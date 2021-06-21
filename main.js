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
            txn.parent = [];
            let i = 3;
            while (listItem[i]) {
                txn.parent.push(listItem[i]);
                i++;
            }
            console.log(txn)
            ans.push(txn);
        });
    })
})


fs.createReadStream('mempool.csv').pipe(parse_csv);