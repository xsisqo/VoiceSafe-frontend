const sharp = require("sharp")

const sizes = [72,96,128,144,152,192,384,512]

async function run() {

for (const size of sizes) {

await sharp("icons/voicesafe-master.png")
.resize(size,size,{
fit:"contain",
background:{r:0,g:0,b:0,alpha:0}
})
.toFile(`icons/voicesafe-${size}.png`)

}

await sharp("icons/voicesafe-master.png")
.resize(512,512,{
fit:"contain",
background:{r:0,g:0,b:0,alpha:0}
})
.toFile("icons/voicesafe-maskable-512.png")

console.log("✔ VoiceSafe icons generated")

}

run()