// MongoDB数据库连接器
const mongoose = require('mongoose');

// 定义Mongoose模型
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  coins: { type: Number, default: 0 },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加密码验证方法
UserSchema.methods.verifyPassword = function(compareFunction, password) {
  return compareFunction(password, this.passwordHash);
};

const SoftwareSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  version: { type: String, required: true },
  price: { type: Number, required: true },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // purchase, transfer, reward
  amount: { type: Number, required: true },
  itemId: { type: String },
  itemType: { type: String },
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

class MongoDBConnector {
  constructor() {
    this.connection = null;
    this.User = null;
    this.Software = null;
    this.Product = null;
    this.Transaction = null;
  }

  // 连接到MongoDB
  async connect(uri = 'mongodb://localhost:27017/cat9') {
    try {
      this.connection = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      
      // 初始化模型
      this.User = mongoose.model('User', UserSchema);
      this.Software = mongoose.model('Software', SoftwareSchema);
      this.Product = mongoose.model('Product', ProductSchema);
      this.Transaction = mongoose.model('Transaction', TransactionSchema);
      
      console.log('MongoDB数据库已连接');
      return true;
    } catch (error) {
      console.error('MongoDB连接失败:', error.message);
      throw error;
    }
  }

  // 断开连接
  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        console.log('MongoDB数据库已断开连接');
        return true;
      }
      return false;
    } catch (error) {
      console.error('MongoDB断开连接失败:', error.message);
      throw error;
    }
  }

  // 用户相关方法
  async createUser(userData) {
    const user = new this.User(userData);
    return await user.save();
  }

  async getUserByUsername(username) {
    return await this.User.findOne({ username });
  }

  async getUserById(id) {
    return await this.User.findById(id);
  }

  async updateUser(id, userData) {
    return await this.User.findByIdAndUpdate(id, { ...userData, updatedAt: Date.now() }, { new: true });
  }

  // 软件相关方法
  async createSoftware(softwareData) {
    const software = new this.Software(softwareData);
    return await software.save();
  }

  async getSoftwareById(id) {
    return await this.Software.findById(id);
  }

  async getAllSoftware() {
    return await this.Software.find();
  }

  async updateSoftware(id, softwareData) {
    return await this.Software.findByIdAndUpdate(id, { ...softwareData, updatedAt: Date.now() }, { new: true });
  }

  // 商品相关方法
  async createProduct(productData) {
    const product = new this.Product(productData);
    return await product.save();
  }

  async getProductById(id) {
    return await this.Product.findById(id);
  }

  async getAllProducts() {
    return await this.Product.find();
  }

  async updateProduct(id, productData) {
    return await this.Product.findByIdAndUpdate(id, { ...productData, updatedAt: Date.now() }, { new: true });
  }

  // 交易相关方法
  async createTransaction(transactionData) {
    const transaction = new this.Transaction(transactionData);
    return await transaction.save();
  }

  async getTransactionById(id) {
    return await this.Transaction.findById(id);
  }

  async getUserTransactions(userId) {
    return await this.Transaction.find({ userId });
  }

  // 更新用户余额
  async updateUserCoins(userId, amount) {
    return await this.User.findByIdAndUpdate(
      userId,
      { $inc: { coins: amount }, updatedAt: Date.now() },
      { new: true }
    );
  }
}

module.exports = MongoDBConnector;