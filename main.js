const fs = require("fs");
const parse = require("csv-parse");
const async = require("async");


//https://stackoverflow.com/questions/23080413/parsing-a-csv-file-using-nodejs
//Parsing csv file
let ans = [];
const parse_csv = parse({ delimiter: "," }, (err, data) => {
    async.eachSeries(data, (line, callback) => {
        //console.log(data);
        data.map((listItem, index) => {
            //console.log(listItem)=[ 'tx_id', 'fee', 'weight', 'parents ' ]
            //console.log(index)= 1-5214
            const txn = {};
            txn.no = index;
            txn.tx_id = listItem[0];
            txn.fee = listItem[1];
            txn.weight = listItem[2];
            txn.maxbymin = txn.fee / txn.weight;
            txn.parent = [];
            let i = 3;
            while (listItem[i]) {
                txn.parent.push(listItem[i]);
                i++;
            }
            //console.log(txn)
            ans.push(txn);
        });
        ans.sort((a, b) => b.maxbymin - a.maxbymin);
        //console.log(ans)

        const block = [], maxwt = 4000000;
        let wt = 0, fee = 0;
        for (i = 1; i < ans.length; i++) {
            if (ans[i].weight < maxwt - wt) {
                //If txn already added
                if (block.includes(ans[i].tx_id)) {
                    continue;
                }
                //If parent exists add parent
                if (ans[i].parent) {
                    ans[i].parent.map((txn) => {
                        if (txn.weight <= maxwt - wt) {
                            wt += parseInt(txn.weight);
                            fee += parseInt(txn.fee);
                            block.push(txn.tx_id);
                        }
                    });
                }
                //Add anyway
                block.push(ans[i].tx_id);
                wt += parseInt(ans[i].weight);
                fee += parseInt(ans[i].fee);
            }
            else {
                break;
            }
        }
        console.log(block);
    })
})


fs.createReadStream('mempool.csv').pipe(parse_csv);