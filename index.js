const express = require('express')
const app = express()
app.use(express.json())

// 内存房间数据，进程休眠/重启全部丢失，不落地存储
let room = {
  roomStatus: "playing",
  players: [
    {playerName:"张", role:"红一", isPublic:false},
    {playerName:"王", role:"红二", isPublic:false},
    {playerName:"杨", role:"蓝一", isPublic:false},
    {playerName:"赵", role:"蓝二", isPublic:false}
  ]
}

// 洗牌函数
function shuffle(arr) {
  const a = [...arr]
  for(let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 获取房间数据
app.get('/api/getRoom', (req, res)=>{
  res.json(room)
})

// 交换两名玩家身份
app.post('/api/swapRole', (req,res)=>{
  const {p1Name, p2Name} = req.body
  const players = room.players
  const idx1 = players.findIndex(p=>p.playerName === p1Name)
  const idx2 = players.findIndex(p=>p.playerName === p2Name)
  const temp = players[idx1].role
  players[idx1].role = players[idx2].role
  players[idx2].role = temp
  room.players = players
  res.json({success:true, players:room.players})
})

// 曝光玩家
app.post('/api/revealPlayer', (req,res)=>{
  const {pName} = req.body
  const target = room.players.find(p=>p.playerName === pName)
  target.isPublic = true
  res.json({success:true, players:room.players})
})

// 重置本局，重新洗牌
app.post('/api/resetRoom', (req,res)=>{
  const rolePool = ["红一","红二","蓝一","蓝二"]
  const shuffled = shuffle(rolePool)
  room.players = [
    {playerName:"张", role:shuffled[0], isPublic:false},
    {playerName:"王", role:shuffled[1], isPublic:false},
    {playerName:"杨", role:shuffled[2], isPublic:false},
    {playerName:"赵", role:shuffled[3], isPublic:false}
  ]
  res.json({success:true, players:room.players})
})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
  console.log(`server running at port ${port}`)
})
