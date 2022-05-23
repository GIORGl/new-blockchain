import * as sha256 from "crypto-js/sha256";

export class Transactions {
  constructor(
    public fromAddress: string,
    public toAddress: string,
    public amount: number,
    public signature?
  ) {}

  calculateHash() {
    return sha256(this.amount + this.toAddress + this.fromAddress).toString();
  }

  signTransaction(signingKey) {
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");

    this.signature = sig.toDER('hex');
  }
}

export class Block {
  public hash: string;
  public nonce: number;

  constructor(
    public timeStamp: string,
    public transactions: Transactions[],
    public previousHash?: string
  ) {
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return sha256(
      this.previousHash +
        this.timeStamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty: number) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined! ", this.hash);
  }
}

export class BlockChain {
  public chain: Block[];
  public difficulty: number;
  public pendingTransactions: Transactions[];
  public miningReward;
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;

    this.pendingTransactions = [];

    this.miningReward = 100;
  }

  createGenesisBlock(): Block {
    return new Block(
      "1/1/2022",
      [
        {
          toAddress: "#",
          fromAddress: "#",
          amount: 0,
          calculateHash() {},
          signTransaction() {},
        },
      ],
      "0"
    );
  }

  isChainValid(): Boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== prevBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  createTransaction(transaction: Transactions) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address: string) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  minePendingTransactions(miningRewardAdress: string) {
    let block = new Block(Date.now().toString(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block mined!");

    this.chain.push(block);

    this.pendingTransactions = [
      new Transactions(null, miningRewardAdress, this.miningReward),
    ];
  }
}
