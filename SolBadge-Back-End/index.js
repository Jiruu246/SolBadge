// Image
// Date/time of mint
// Address of the NFT
// Name
// Description

let nftData = []
// {name: "bla bla nft", timestamp: "1686847277", description: "afadfjnajidjaeind", address: "892n823h23e", image: "skrt.jpeg"}

const axios = require("axios");
const express = require("express")
require('dotenv').config();

const app = express()
app.use(express.json())

app.listen("3003", () => {
    console.log("Server Listening on PORT:", 3000);
});

app.get("/nfts", async (req, res) => {
    console.log(req.query)
    if (!req.query.addr) {
        return res.status(500).send("No addr query, please add wallet address")
    }
    const walletAddress = req.query.addr
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
        jsonrpc: "2.0",
        id: 1,
        method: "getAssetsByOwner",
        //2TC5v3bBbeaFtKMEBbTTmXKugasqQSAB5adR6NLLqJ9i
        params: {"ownerAddress":walletAddress},
      };

      nftData[walletAddress] = []
      try {
        const response = await axios.post(
          `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
          data,
          config
        );
    
        let items = response.data.result.items;
        items = items.filter(item => 
            item.content && 
            item.content.metadata && 
            item.content.metadata.attributes && 
            item.content.metadata.attributes.some(attr => attr.trait_type == 'poap')
          );
        
        console.log(items)
    
        const batchSize = 8; // Adjust this value based on rate limits
        const delayBetweenBatches = 1000; // 1 second delay between batches
    
        for (let i = 0; i < items.length; i += batchSize) {
          const batch = items.slice(i, i + batchSize);
          await processBatch(batch, config, walletAddress);
          if (i + batchSize < items.length) {
            await delay(delayBetweenBatches);
          }
        }
    
        if (req.query.order) {
          const grouped = {};
          const chosenOrder = req.query.order

          // Loop through nftData array
          nftData[walletAddress].forEach(item => {
              const date = new Date(item.timestamp * 1000); // Convert unix timestamp to Date
              const month = date.toLocaleString('default', { month: 'long' }); // Get month name
              const year = date.getFullYear(); // Get year

              if (chosenOrder == "year"){
                console.log("year")
                if (!grouped[year]) {
                  grouped[year] = [];
                }
                grouped[year].push(item);
              } else {
                console.log("month")
                if (!grouped[year]) {
                  grouped[year] = {
                    [month]: []
                  }
                }
                grouped[year][month].push(item);
              }

              console.log(grouped)

              // test = {
              //   ["data"]: {
              //     ["2024"]: {
              //       ["October"]: [
              //         {"nft1": "ads"},
              //         {"nft2": "asd"}
              //       ]
              //     }
              //   }
              // }

          });

          nftData[walletAddress] = grouped
        }

        console.log(nftData[walletAddress])

        return res.status(200).json({
            data: nftData[walletAddress]
        });
    
      } catch (err) {
        console.error("Error in main process:", err.message);
      }
})

// Utility function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to process a batch of items
async function processBatch(batch, config, walletAddress) {
  for (const item of batch) {
    if (item.interface == "V1_NFT" || item.interface == "MplCoreAsset") {
      const data2 = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getSignaturesForAddress",
        "params": [item.id]
      };
      let nftName = item.content.metadata.name
      let nftDesc = item.content.metadata.description
      let nftImg = item.content.links.image
      console.log(item.id)
      console.log(item.content.metadata.name)
      console.log(item.content.metadata.description)
      console.log(item.content.links.image)
      console.log(item.content.metadata.attributes)
      const nftAttributeLocation = item.content.metadata.attributes.find(attr => attr.trait_type === 'location')?.value;
      try {
        const sigResponse = await axios.post(
          `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
          data2,
          config
        );
        console.log(sigResponse.data)
        console.log(sigResponse.data.result[sigResponse.data.result.length - 1])
        nftData[walletAddress].push({
          name: nftName, 
          timestamp: sigResponse.data.result[sigResponse.data.result.length - 1].blockTime,
          description: nftDesc, 
          address: item.id, 
          image: nftImg, 
          location: nftAttributeLocation || null
        })

        // for (const sigs of sigResponse.data.result) {
        //   if (sigs[1] == 'MintToCollectionV1') {
        //     const data3 = {
        //       "jsonrpc": "2.0",
        //       "id": 1,
        //       "method": "getTransaction",
        //       "params": [sigs[sigs.length], "json"]
        //     };

        //     try {
        //       const txResponse = await axios.post(
        //         `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
        //         data3,
        //         config
        //       );
        //       if (txResponse.data.result.blockTime == null)
        //         console.log(txResponse.data.result);

        //       nftData[walletAddress].push({name: nftName, timestamp: txResponse.data.result.blockTime, description: nftDesc, address: item.id, image: nftImg})
        //       // Process txResponse.data here
        //     } catch (error) {
        //       console.error("Error fetching transaction:", error.message);
        //     }
        //   }
        // }
      } catch (error) {
        console.error("Error fetching signatures:", error.message);
      }
    }
    // Add a small delay between each item in the batch
    await delay(100);
  }
}

// Ariels: DNuPfuyFw1mvM4Xm4UhzeNSBnmxSeoDhdjjok3Ux8AnU

// (async () => {
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   const data = {
//     jsonrpc: "2.0",
//     id: 1,
//     method: "getAssetsByOwner",
//     //2TC5v3bBbeaFtKMEBbTTmXKugasqQSAB5adR6NLLqJ9i
//     params: {"ownerAddress":"2TC5v3bBbeaFtKMEBbTTmXKugasqQSAB5adR6NLLqJ9i"},
//   };

//   try {
//     const response = await axios.post(
//       `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
//       data,
//       config
//     );

//     let items = response.data.result.items;
//     items = items.filter(item => 
//         item.content && 
//         item.content.metadata && 
//         item.content.metadata.attributes && 
//         item.content.metadata.attributes.length > 0
//       );

//     const batchSize = 8; // Adjust this value based on rate limits
//     const delayBetweenBatches = 1000; // 1 second delay between batches

//     for (let i = 0; i < items.length; i += batchSize) {
//       const batch = items.slice(i, i + batchSize);
//       await processBatch(batch, config);
//       if (i + batchSize < items.length) {
//         await delay(delayBetweenBatches);
//       }
//     }

//     console.log(nftData)

//   } catch (err) {
//     console.error("Error in main process:", err.message);
//   }
// })();
