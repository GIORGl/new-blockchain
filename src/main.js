"use strict";
exports.__esModule = true;
var blockchain_1 = require("./blockchain");
var KichiCoin = new blockchain_1.BlockChain();
KichiCoin.createTransaction(new blockchain_1.Transactions("address1", "address2", 100));
KichiCoin.createTransaction(new blockchain_1.Transactions("address2", "address1", 90));
console.log("\n Start the miner.....");
KichiCoin.minePendingTransactions("kichi-address");
console.log("\n Balance of miner(me: kichi) is: ", KichiCoin.getBalanceOfAddress("address1"));
console.log("\n Start the miner again.....");
console.log("trans:", KichiCoin.pendingTransactions);
KichiCoin.minePendingTransactions("kichi-address");
console.log("\n Balance of miner(me: kichi) is: ", KichiCoin.getBalanceOfAddress("address2"));
