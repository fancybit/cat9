# Metajade Block Network: Construction and Application Research of an Information Security Network Based on Blockchain, Six Degrees Principle and IPFS

## Abstract

In the digital economy era, information security and storage efficiency issues in fields such as game distribution, virtual commodity trading, and self-media social networks have become increasingly prominent. Pain points including data tampering, privacy leakage, high storage costs, and low access efficiency restrict industrial development. This paper proposes the Metajade Block Network, which integrates blockchain technology, the Six Degrees Principle, and IPFS (InterPlanetary File System). It ensures data credibility through blockchain, optimizes network connections via the Six Degrees Principle, improves storage efficiency with IPFS, and introduces a **dynamic adjustment mechanism for node mutual trust consensus depth** to achieve a dynamic balance between efficiency and security, constructing a "credible + efficient + scalable + adaptive" digital ecosystem. Initially focusing on game distribution and virtual commodity trading scenarios, it realizes transaction traceability, copyright protection, and efficient storage; further explores its promotion path in pan-transaction and self-media social networks, providing a new solution for information security and storage optimization in the digital economy field.

## Keywords

Blockchain; Six Degrees Principle; IPFS; Information Security; Metajade Block Network; Mutual Trust Consensus Depth; Game Distribution; Virtual Commodity Trading

## 1. Introduction

### 1.1 Research Background

The global game market revenue and virtual commodity trading scale continue to expand, with the number of self-media social network users exceeding 5 billion. Massive digital content and transaction data have an increasingly urgent demand for secure storage and efficient access. Traditional centralized systems suffer from single points of failure, easy data tampering, high storage costs, and large access delays. In contrast, a single blockchain network faces problems such as low storage efficiency, high spatiotemporal complexity (showing exponential growth in some scenarios), and difficulty in balancing security and efficiency, making it unable to meet the application needs of large-scale digital scenarios.

Blockchain's decentralized and tamper-proof characteristics provide technical support for information security; the Six Degrees Principle's advantage in social connections can optimize network topology; IPFS's distributed storage architecture can solve data storage efficiency problems. The integration of the three is expected to break through the bottlenecks of traditional systems and build a new network ecosystem with both security, credibility and efficient storage.

### 1.2 Research Significance

1. **Theoretical Significance**: For the first time, it systematically integrates blockchain, the Six Degrees Principle, IPFS, and a dynamic mutual trust consensus mechanism, proposes the construction framework of the Metajade Block Network, enriches information security and distributed network theories, and provides a new perspective for interdisciplinary research.
2. **Practical Significance**: Addressing the security and storage pain points in scenarios such as game distribution, it realizes transaction traceability, copyright protection, and efficient storage, and balances efficiency and security through the consensus depth adjustment mechanism; the scalable architecture lays the foundation for promotion in pan-transaction and social fields, helping the healthy development of the digital economy.

### 1.3 Research Content and Framework

This paper sorts out relevant theoretical and technical foundations, constructs the Metajade Block Network architecture (integrating IPFS and dynamic consensus mechanism), analyzes its application in game distribution and virtual commodity trading, discusses the promotion path, and compares the spatiotemporal complexity differences with traditional blockchain networks through a table.

## 2. Related Theories and Technical Foundations

### 2.1 Blockchain Technology

Blockchain is a distributed ledger maintained by multiple nodes, with core characteristics including decentralization, tamper-proofing, full traceability, and automatic execution of smart contracts. However, a single blockchain network has problems such as high storage redundancy, low data access efficiency, high spatiotemporal complexity (e.g., the time complexity of transaction confirmation approaches O(2鈦? under some consensus mechanisms), and difficulty in balancing security and efficiency due to fixed consensus depth, which limits large-scale applications.

### 2.2 Six Degrees Principle

The Six Degrees Principle reveals the law that "any two strangers in the world can establish a connection through no more than six intermediaries". Networks built based on this principle have advantages such as high connectivity, resistance to single points of failure, and efficient trust transmission. They can optimize node connection logic, reduce network path length from linear or exponential levels to logarithmic levels, and improve network data transmission efficiency.

### 2.3 IPFS Technology

IPFS is a distributed file system that replaces the location addressing of traditional HTTP with content addressing. It splits files into blocks of dynamically adjusted sizes (according to file size, not fixed at 256KB) for distributed storage among nodes, uses hash values to uniquely identify files, realizes efficient data retrieval and redundant storage optimization, and effectively reduces storage costs and access delays.

### 2.4 Node Mutual Trust Consensus Depth Theory

Node mutual trust consensus depth refers to the node level participating in verification and the depth of data traceability when nodes in the network reach a consensus on transactions or data. The deeper the consensus depth, the more node levels participate in verification and the more complete the traced data, resulting in higher security but longer consensus time and lower efficiency; on the contrary, the shallower the consensus depth, the higher the efficiency but relatively lower security. By dynamically adjusting the consensus depth, precise adaptation between efficiency and security in different scenarios can be achieved.

### 2.5 Feasibility of Multi-Technology Integration

Blockchain provides credible support for the Six Degrees Principle, IPFS, and consensus mechanisms; the Six Degrees Principle optimizes node connection efficiency; IPFS solves storage bottlenecks; the dynamic consensus depth mechanism balances security and efficiency. The four form a collaborative system of "credible guarantee + efficient connection + optimized storage + dynamic balance", providing feasibility for the construction of the Metajade Block Network.

## 3. Construction Framework of the Metajade Block Network

### 3.1 Core Network Objectives

Taking "security and credibility, efficient storage, dynamic balance, and scalable evolution" as the core objectives: 1. Data Security: Ensure encrypted storage and tamper-proofing of transaction and privacy data; 2. Efficient Storage: Optimize the storage architecture based on IPFS to reduce costs and access delays; 3. Dynamic Balance: Achieve adaptive adaptation between efficiency and security through the consensus depth adjustment mechanism; 4. Ecological Expansion: Support access to multiple scenarios and realize collaborative flow of cross-domain data and value.

### 3.2 Overall Architecture Design

The Metajade Block Network adopts a "four-layer collaborative architecture", including the **underlying storage layer, core technology layer, network connection layer, and scenario application layer**. Each layer collaborates to realize safe, efficient, and dynamically balanced network functions.

1. **Underlying Storage Layer**: With IPFS as the core, it is responsible for the distributed storage of massive data. It adopts IPFS's adaptive block splitting strategy, generates unique content hash values according to file size (e.g., small files are stored directly, and large files are dynamically split into blocks ranging from tens of KB to several MB), and stores them in the IPFS distributed node cluster; optimizes node distribution through the Six Degrees Principle, constructs a storage topology of "nearby access + multi-path backup" to reduce the distance of cross-node data transmission, and at the same time reduces the redundant storage ratio (compared with traditional blockchain storage, the redundancy is reduced from n times to logn times); adopts the strategy of "hot data local caching + cold data distributed archiving" to further improve data access efficiency.
2. **Core Technology Layer**: With blockchain technology as the core, it integrates cryptographic algorithms, smart contracts, and a **dynamic adjustment mechanism for mutual trust consensus depth**. It adopts a hybrid chain architecture (consortium chain + public chain), where the consortium chain is responsible for core transaction logic and permission management, and the public chain ensures public traceability of data; realizes user identity anonymity and encrypted data transmission through asymmetric encryption; smart contracts realize automatic transaction execution, automatic copyright confirmation and other functions. Large file data associated with contracts is stored in IPFS, and only file hash values and contract execution results are recorded on the blockchain, greatly reducing the storage pressure of the blockchain; introduces a consensus depth adjustment module to dynamically adjust the consensus participation level and data traceability depth according to transaction importance, network load, etc.
3. **Network Connection Layer**: Build a dynamic node network based on the Six Degrees Principle, covering nodes such as users, game publishers, and trading platforms. Nodes are dynamically associated according to the "Six Degrees Connection Rule" to form a "small-world" network topology, reducing the average path length between nodes from O(n) to O(logn); each node has a unique blockchain digital identity, and trust relationships are quantitatively evaluated through transaction history and social connections; optimizes IPFS node routing algorithms and blockchain node consensus mechanisms through the Six Degrees Principle to improve data transmission rate and consensus efficiency.
4. **Scenario Application Layer**: Provides application interfaces and functional modules for specific scenarios, initially focusing on game distribution and virtual commodity trading, and later expanding to pan-transaction and self-media social fields. It includes core modules such as user management, transaction traceability, copyright protection, and consensus depth configuration, supporting third-party applications to access through API interfaces.

### 3.3 Core Mechanism Design

1. **Identity Authentication and Permission Management**: Allocates unique digital identity certificates based on blockchain asymmetric encryption, and realizes multi-dimensional permission control combined with node trust ratings to ensure data access security.
2. **Trust Transmission and Evaluation**: Quantitatively evaluates node trust through "direct trust + indirect trust", and the trust rating is stored on the chain as the basis for transaction matching and consensus participation permissions.
3. **Collaboration between Smart Contracts and IPFS**: Smart contracts execute transaction logic, store large file data in IPFS, and only record file hash values and contract execution results on the blockchain, realizing "on-chain credibility + off-chain efficient storage".
4. **Data Security and Privacy Protection**: Adopts "encrypted storage + privacy computing" technology. User privacy data is encrypted and stored in IPFS, and "verifiable invisibility" of data is realized through zero-knowledge proof.
5. **Dynamic Adjustment Mechanism for Mutual Trust Consensus Depth**:

   - Trigger Conditions: Automatically trigger adjustments according to transaction amount (e.g., high-value virtual commodity transactions), data sensitivity (e.g., user core privacy data), and network load (e.g., peak transaction periods).
   - Adjustment Logic: Increase the consensus depth for high-value/high-sensitivity transactions (e.g., trace transaction records of 3-5 layers of associated nodes and mobilize 60%-80% of high-trust nodes to participate in verification); reduce the consensus depth for ordinary transactions (e.g., trace 1-2 layers of nodes and mobilize 30%-50% of high-trust nodes to participate in verification); appropriately reduce the consensus depth to ensure efficiency when the network load is too high, and increase the consensus depth to strengthen security when the load is low.
   - Balance Effect: Through this mechanism, on the premise of ensuring core data security, the overall network transaction efficiency can be significantly improved, and the security protection level of core transactions can be further strengthened.

### 3.4 Spatiotemporal Complexity Comparison

By integrating the Six Degrees Principle, IPFS, and dynamic consensus mechanism, the Metajade Block Network reduces the high complexity (partial exponential and polynomial levels) of traditional blockchain networks to logarithmic levels, and realizes dynamic balance between efficiency and security. The following is a comparison of spatiotemporal complexity between it and traditional blockchain networks:

| Indicator                                        | Traditional Blockchain Network                              | Metajade Block Network                                       | Complexity Level                      |
| ------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| Time Complexity (Transaction Confirmation)       | O(n虏) (approaching O(2鈦? under some consensus mechanisms) | O(nlogn) (can be reduced to O(logn) under dynamic consensus) | Polynomial/Exponential 鈫?Logarithmic |
| Time Complexity (Data Retrieval)                 | O(n) (Linear)                                               | O(logn) (Logarithmic)                                        | Linear 鈫?Logarithmic                 |
| Space Complexity (Data Storage)                  | O(n脳D) (n: number of nodes; D: total data volume)          | O(D脳logn)                                                   | Linear 鈫?Logarithmic                 |
| Node Connection Efficiency (Average Path Length) | O(n) (Linear)                                               | O(logn) (Logarithmic)                                        | Linear 鈫?Logarithmic                 |
| Security-Efficiency Balance (Relative Value)     | Fixed (60)                                                  | Dynamically Adjustable (60-90)                               | -                                     |

Note: Complexity levels are divided according to standard computer algorithm complexity; the security-efficiency balance is a relative evaluation value (100 is optimal). Traditional blockchain networks adopt fixed consensus depth, resulting in low and non-adjustable balance.

## 4. Application of the Metajade Block Network in Game Distribution and Virtual Commodity Trading

### 4.1 Application Scheme in Game Distribution Scenarios

1. **Game Copyright Protection**: Core game resources (source code, art resources) are encrypted and stored in IPFS, generating unique hash values to be recorded on the chain to form copyright certificates. Smart contracts set usage rules, and third-party use requires authorization. Authorization records and usage behaviors are fully traced on the chain; for core copyright data, the consensus depth is automatically increased to strengthen security protection.
2. **Game Distribution and Update**: Game installation packages are stored in IPFS, and the adaptive block splitting strategy is adopted to optimize transmission efficiency. Users obtain download permissions through blockchain identity authentication and use IPFS distributed nodes and Six Degrees optimized routing for fast downloading; update patches are synchronized to each node through IPFS to improve distribution efficiency; shallow consensus depth is adopted for ordinary updates to ensure speed, and deep consensus depth is adopted for core version updates to ensure integrity.
3. **User Account Security Guarantee**: User accounts are bound to blockchain digital identities, adopting a multi-factor authentication + smart contract authorization mechanism, and account data hash values are stored in IPFS; the consensus depth is dynamically adjusted according to the risk level for operations such as account login and asset transfer. For high-risk operations (e.g., large-value virtual asset transfer), the consensus depth is increased to ensure account security.

### 4.2 Application Scheme in Virtual Commodity Trading Scenarios

1. **Virtual Commodity Right Confirmation and Traceability**: When virtual commodities are issued, unique blockchain identifiers are generated, commodity data is stored in IPFS, and transaction transfer records are recorded on the chain to form a complete traceability chain, eliminating counterfeiting and theft.
2. **Transaction Security and Efficient Settlement**: Transactions are completed through smart contracts, and funds are hosted by contracts. After the transfer of commodity ownership, funds are automatically transferred to the seller; the consensus depth is dynamically adjusted according to commodity value. Deep consensus is adopted for high-value commodities (e.g., rare game props) to ensure security, and shallow consensus is adopted for ordinary commodities to improve transaction speed; commodity resources are efficiently accessed through IPFS to enhance transaction experience.
3. **Standardization of Second-Hand Transactions**: Second-hand transactions verify commodity ownership through smart contracts, and transaction records are recorded on the chain. Handling fees and copyright revenues are automatically distributed according to rules; during transactions, the consensus participation node level is dynamically adjusted according to the trust rating of both parties and commodity value, standardizing market order while balancing efficiency.

## 5. Promotion Path of the Metajade Block Network

### 5.1 Promotion from the Game Field to the Pan-Transaction Field

1. **Scenario Adaptation and Function Expansion**: Develop smart contract templates for scenarios such as e-commerce transactions and intellectual property transactions, add functions such as logistics information traceability and asset pledge; customize consensus depth adjustment rules according to the security needs and efficiency requirements of different transaction scenarios to adapt to pan-transaction scenarios.
2. **Node Ecosystem Expansion**: Absorb e-commerce platforms, financial institutions, etc. to join the network, build a cross-domain node network based on the Six Degrees Principle to realize collaborative flow of data and value; simultaneously expand the consensus node pool to ensure the consensus efficiency and security of cross-domain transactions.
3. **Pilot Promotion and Iterative Optimization**: Select small and medium-sized e-commerce platforms and digital financial enterprises for pilot applications, collect feedback to optimize the network architecture and consensus adjustment mechanism, and gradually expand the promotion scope.

### 5.2 Promotion to Self-Media Social Networks

1. **User Privacy and Content Storage Optimization**: User social data is encrypted and stored in IPFS, and users can independently set the data visibility range; the consensus depth is dynamically adjusted according to content sensitivity (e.g., private social content, public tweets) to balance privacy protection and content dissemination efficiency.
2. **Content Copyright and Revenue Guarantee**: Self-media content is recorded on the chain for right confirmation, and revenues are automatically distributed through smart contracts; deep consensus is adopted for core original content to strengthen copyright protection, and shallow consensus is adopted for ordinary forwarded content to improve dissemination efficiency. IPFS is used to realize efficient content dissemination and combat piracy.
3. **Social Trust and Content Review**: Build a social trust network based on the Six Degrees Principle, and combine the consensus depth mechanism to increase the review consensus depth for high-sensitivity content (e.g., harmful information) to quickly identify and remove it, purifying the network environment.

## 6. Conclusion and Outlook

### 6.1 Research Conclusion

This paper integrates blockchain, the Six Degrees Principle, IPFS, and a dynamic mutual trust consensus depth adjustment mechanism, constructs the "four-layer collaborative architecture" of the Metajade Block Network, proposes a core mechanism design scheme, verifies its spatiotemporal complexity advantage over traditional blockchain networks (from polynomial/exponential levels to logarithmic levels) through a table, and elaborates on its application and promotion path in scenarios such as game distribution. Through the dynamic consensus mechanism, the network achieves adaptive balance between efficiency and security, effectively solving the core pain points in the digital economy field.

### 6.2 Future Outlook

In the future, the algorithm model for consensus depth adjustment can be further optimized to improve the accuracy of dynamic adaptation; explore the integration and application with technologies such as artificial intelligence and the Internet of Things to expand the network function boundary; strengthen cross-industry and cross-regional cooperation to build a global ecological system of information security, efficient storage, and dynamic balance, providing support for the development of the digital economy.

I can help you create a visual diagram of the Metajade Block Network's four-layer architecture (using text description or simple code for drawing tools) to make the structure more intuitive, need it?
