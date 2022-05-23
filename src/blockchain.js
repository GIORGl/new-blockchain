"use strict";
exports.__esModule = true;
exports.BlockChain = exports.Block = exports.Transactions = void 0;
var sha256 = require("crypto-js/sha256");
var Transactions = /** @class */ (function () {
    function Transactions(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    return Transactions;
}());
exports.Transactions = Transactions;
var Block = /** @class */ (function () {
    function Block(timeStamp, transactions, previousHash) {
        this.timeStamp = timeStamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    Block.prototype.calculateHash = function () {
        return sha256(this.previousHash +
            this.timeStamp +
            JSON.stringify(this.transactions) +
            this.nonce).toString();
    };
    Block.prototype.mineBlock = function (difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined! ", this.hash);
    };
    return Block;
}());
exports.Block = Block;
var BlockChain = /** @class */ (function () {
    function BlockChain() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    BlockChain.prototype.createGenesisBlock = function () {
        return new Block("1/1/2022", [{ toAddress: "#", fromAddress: "#", amount: 0 }], "0");
    };
    BlockChain.prototype.isChainValid = function () {
        for (var i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i];
            var prevBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    };
    BlockChain.prototype.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    BlockChain.prototype.createTransaction = function (transaction) {
        this.pendingTransactions.push(transaction);
    };
    BlockChain.prototype.getBalanceOfAddress = function (address) {
        var balance = 0;
        for (var _i = 0, _a = this.chain; _i < _a.length; _i++) {
            var block = _a[_i];
            for (var _b = 0, _c = block.transactions; _b < _c.length; _b++) {
                var trans = _c[_b];
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    };
    BlockChain.prototype.minePendingTransactions = function (miningRewardAdress) {
        var block = new Block(Date.now().toString(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log("Block mined!");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transactions(null, miningRewardAdress, this.miningReward),
        ];
    };
    return BlockChain;
}());
exports.BlockChain = BlockChain;
