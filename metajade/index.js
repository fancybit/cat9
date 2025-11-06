import {
  createLibp2p
} from 'libp2p'
import { TCP } from '@libp2p/tcp'
import { WebSockets } from '@libp2p/websockets'
import { Noise } from '@libp2p/noise'
import { Mplex } from '@libp2p/mplex'
import { KadDHT } from '@libp2p/kad-dht'
import { Bootstrap } from '@libp2p/bootstrap'
import { Identify } from '@libp2p/identify'
import { createFromJSON, createEd25519PeerId } from '@libp2p/peer-id'
import { pipe } from 'it-pipe'
import { fromString, toString } from 'uint8arrays'
import { JadeDB } from './jadedb.js'

/**
 * CatPeer - P2P网络中的普通节点类
 * 负责与其他节点建立连接、发送消息和接收数据
 */
export class JadePeer {
  constructor(options = {}) {
    this.options = {
      id: null,
      port: options.port || 0,
      bootstrap: options.bootstrap || [],
      ...options
    }
    this.libp2p = null
    this.isStarted = false
    this.peerStore = new Map()
  }

  /**
   * 初始化并启动P2P节点
   */
  async start() {
    try {
      // 创建或使用提供的peerId
      let peerId
      if (this.options.id) {
        peerId = await createFromJSON(this.options.id)
      } else {
        peerId = await createEd25519PeerId()
      }

      // 配置libp2p
      this.libp2p = await createLibp2p({
        peerId,
        addresses: {
          listen: [
            `/ip4/0.0.0.0/tcp/${this.options.port}`,
            `/ip4/0.0.0.0/tcp/${this.options.port + 1}/ws`
          ]
        },
        transports: [
          new TCP(),
          new WebSockets()
        ],
        connectionEncryption: [
          new Noise()
        ],
        streamMuxers: [
          new Mplex()
        ],
        peerDiscovery: [
          new Bootstrap({
            list: this.options.bootstrap,
            interval: 1000
          })
        ],
        services: {
          identify: new Identify(),
          dht: new KadDHT({
            clientMode: true
          })
        }
      })

      // 监听事件
      this._setupEventListeners()

      // 启动libp2p
      await this.libp2p.start()
      this.isStarted = true
      console.log(`CatPeer started with ID: ${this.libp2p.peerId.toString()}`)
      
      // 打印节点地址信息
      const addrs = this.libp2p.getMultiaddrs()
      console.log('节点地址:', addrs.map(addr => addr.toString()))
      
      return this
    } catch (error) {
      console.error('Failed to start CatPeer:', error)
      throw error
    }
  }

  /**
   * 设置事件监听器
   */
  _setupEventListeners() {
    // 发现新节点
    this.libp2p.addEventListener('peer:discovery', (evt) => {
      const peerInfo = evt.detail
      console.log(`发现新节点: ${peerInfo.id.toString()}`)
      this.peerStore.set(peerInfo.id.toString(), peerInfo)
    })

    // 连接建立
    this.libp2p.connectionManager.addEventListener('peer:connect', (evt) => {
      const connection = evt.detail
      console.log(`已连接到节点: ${connection.remotePeer.toString()}`)
    })

    // 连接断开
    this.libp2p.connectionManager.addEventListener('peer:disconnect', (evt) => {
      const connection = evt.detail
      console.log(`与节点断开连接: ${connection.remotePeer.toString()}`)
    })

    // 收到消息
    this.libp2p.handle('/metajade/message/1.0.0', async ({ stream }) => {
      try {
        const result = await pipe(stream, async function* (source) {
          for await (const chunk of source) {
            yield chunk
          }
        })
        
        const message = toString(Buffer.concat(result))
        console.log('收到消息:', message)
        this.emit('message', { message, source: stream.stat.remotePeer.toString() })
      } catch (error) {
        console.error('处理消息时出错:', error)
      }
    })
  }

  /**
   * 停止P2P节点
   */
  async stop() {
    if (this.isStarted && this.libp2p) {
      await this.libp2p.stop()
      this.isStarted = false
      console.log('CatPeer stopped')
    }
  }

  /**
   * 连接到指定节点
   * @param {string} peerAddress - 节点的multiaddr
   */
  async connect(peerAddress) {
    if (!this.isStarted) {
      throw new Error('CatPeer is not started')
    }

    try {
      await this.libp2p.dial(peerAddress)
      console.log(`已连接到: ${peerAddress}`)
      return true
    } catch (error) {
      console.error(`连接失败: ${peerAddress}`, error)
      return false
    }
  }

  /**
   * 发送消息到指定节点
   * @param {string} peerId - 目标节点ID
   * @param {string} message - 要发送的消息
   */
  async sendMessage(peerId, message) {
    if (!this.isStarted) {
      throw new Error('CatPeer is not started')
    }

    try {
      const stream = await this.libp2p.dialProtocol(peerId, '/metajade/message/1.0.0')
      await pipe([fromString(message)], stream)
      console.log(`消息已发送到 ${peerId}`)
      return true
    } catch (error) {
      console.error(`发送消息失败: ${peerId}`, error)
      return false
    }
  }

  /**
   * 在DHT中查找节点
   * @param {string} peerId - 要查找的节点ID
   */
  async findPeer(peerId) {
    if (!this.isStarted || !this.libp2p.services.dht) {
      throw new Error('DHT not available')
    }

    try {
      const peer = await this.libp2p.services.dht.findPeer(peerId)
      console.log('找到节点:', peer)
      return peer
    } catch (error) {
      console.error(`查找节点失败: ${peerId}`, error)
      return null
    }
  }

  // 事件处理机制
  _events = new Map()
  on(event, handler) {
    if (!this._events.has(event)) {
      this._events.set(event, [])
    }
    this._events.get(event).push(handler)
  }
  emit(event, data) {
    if (this._events.has(event)) {
      this._events.get(event).forEach(handler => handler(data))
    }
  }
  off(event, handler) {
    if (this._events.has(event)) {
      const handlers = this._events.get(event)
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }
}

/**
 * CatHome - P2P网络中的DHT服务器节点类
 * 提供引导节点功能，维护网络拓扑结构
 */
export class JadeHub extends JadePeer {
  constructor(options = {}) {
    super(options)
    this.options = {
      ...this.options,
      bootstrap: [], // 服务器节点不需要bootstrap列表
      port: options.port || 9000
    }
    this.isServer = true
  }

  /**
   * 初始化并启动DHT服务器节点
   */
  async start() {
    try {
      // 创建或使用提供的peerId
      let peerId
      if (this.options.id) {
        peerId = await createFromJSON(this.options.id)
      } else {
        peerId = await createEd25519PeerId()
      }

      // 配置libp2p，作为DHT服务器模式
      this.libp2p = await createLibp2p({
        peerId,
        addresses: {
          listen: [
            `/ip4/0.0.0.0/tcp/${this.options.port}`,
            `/ip4/0.0.0.0/tcp/${this.options.port + 1}/ws`
          ]
        },
        transports: [
          new TCP(),
          new WebSockets()
        ],
        connectionEncryption: [
          new Noise()
        ],
        streamMuxers: [
          new Mplex()
        ],
        // 服务器节点不需要bootstrap发现
        services: {
          identify: new Identify(),
          dht: new KadDHT({
            clientMode: false, // 服务器模式
            kBucketSize: 20,
            // 服务器模式下的配置
            enabled: true,
            randomWalk: {
              enabled: true
            }
          })
        }
      })

      // 监听事件
      this._setupEventListeners()

      // 启动libp2p
      await this.libp2p.start()
      this.isStarted = true
      console.log(`CatHome DHT服务器已启动，ID: ${this.libp2p.peerId.toString()}`)
      
      // 打印节点地址信息
      const addrs = this.libp2p.getMultiaddrs()
      console.log('服务器节点地址:', addrs.map(addr => addr.toString()))
      
      return this
    } catch (error) {
      console.error('Failed to start CatHome:', error)
      throw error
    }
  }

  /**
   * 获取服务器的引导节点地址列表
   * 用于提供给其他节点连接
   */
  getBootstrapAddrs() {
    if (!this.isStarted) {
      throw new Error('CatHome is not started')
    }
    return this.libp2p.getMultiaddrs().map(addr => addr.toString())
  }

  /**
   * 存储数据到DHT
   * @param {string} key - 数据键
   * @param {string} value - 数据值
   */
  async storeData(key, value) {
    if (!this.isStarted || !this.libp2p.services.dht) {
      throw new Error('DHT not available')
    }

    try {
      const keyBytes = fromString(key)
      const valueBytes = fromString(value)
      await this.libp2p.services.dht.put(keyBytes, valueBytes)
      console.log(`数据已存储到DHT: ${key}`)
      return true
    } catch (error) {
      console.error(`存储数据失败: ${key}`, error)
      return false
    }
  }

  /**
   * 从DHT检索数据
   * @param {string} key - 数据键
   */
  async retrieveData(key) {
    if (!this.isStarted || !this.libp2p.services.dht) {
      throw new Error('DHT not available')
    }

    try {
      const keyBytes = fromString(key)
      const result = await this.libp2p.services.dht.get(keyBytes)
      const value = toString(result)
      console.log(`从DHT检索到数据: ${key}`)
      return value
    } catch (error) {
      console.error(`检索数据失败: ${key}`, error)
      return null
    }
  }
}

// MetaJade核心库 - 导出所有核心组件

// 导出数据存储模块
export { JadeDB, BaseEntity, User, Software, Product, Transaction } from './jadedb.js';

// 默认导出
const MetaJade = {
  JadePeer: JadePeer,
  JadeHub: JadeHub,
  JadeDB,
  version: '1.0.0'
};

export default MetaJade;
