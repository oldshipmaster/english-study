import type { LearningPack, RetellPlan, SentencePattern, Story } from "../types";

const pronunciationCues: Record<string, string> = {
  picnic: "PIC-nik", basket: "BAS-kit", moonlight: "MOON-lite", lantern: "LAN-tern", blanket: "BLANG-kit", evening: "EEV-ning", share: "SHAIR", delicious: "dih-LISH-us",
  lunchbox: "LUNCH-boks", missing: "MIS-ing", classroom: "KLASS-room", check: "CHEK", library: "LYE-brer-ee", borrow: "BOR-oh", label: "LAY-bəl", found: "FOWND",
  secret: "SEE-krit", tree: "TREE", ladder: "LAD-er", map: "MAP", key: "KEE", window: "WIN-doh", brave: "BRAYV", together: "tuh-GETH-er",
  morning: "MOR-ning", breakfast: "BREK-fəst", hurry: "HUR-ee", backpack: "BACK-pack", toast: "TOHST", ready: "RED-ee",
  talent: "TAL-ent", stage: "STAYJ", practice: "PRAK-tis", nervous: "NER-vəs", costume: "KOS-toom", applause: "uh-PLAWZ", perform: "per-FORM",
  cloud: "KLOWD", postman: "POHST-mən", letter: "LET-er", address: "AD-dress", storm: "STORM", feather: "FETH-er", deliver: "dih-LIV-er", promise: "PROM-is",
};

const storyCatalog: Omit<Story, "learningPack">[] = [
  {
    id: "moonlight-picnic", title: "The Moonlight Picnic", chineseTitle: "月光野餐", category: "family", minutes: 10, level: "Elementary",
    vocabulary: { picnic: "野餐", basket: "篮子", moonlight: "月光", lantern: "灯笼", blanket: "毯子", evening: "傍晚", share: "分享", delicious: "美味的" },
    roles: [
      { id: "mia", name: "Mia", emoji: "👧", childFriendly: true },
      { id: "dad", name: "Dad", emoji: "👨", childFriendly: false },
      { id: "grandma", name: "Grandma", emoji: "👵", childFriendly: false },
    ],
    lines: [
      { roleId: "mia", english: "Today is our picnic day!", chinese: "今天是我们的野餐日！", vocabulary: ["picnic"], pronunciation: "picnic: PIC-nik（重音在 PIC）" },
      { roleId: "dad", english: "Let us pack the basket.", chinese: "我们来装好篮子吧。", vocabulary: ["basket"] },
      { roleId: "grandma", english: "I made delicious sandwiches.", chinese: "我做了美味的三明治。", vocabulary: ["delicious"] },
      { roleId: "mia", english: "The moonlight is shining.", chinese: "月光正在闪耀。", vocabulary: ["moonlight"] },
      { roleId: "dad", english: "The garden is dark this evening.", chinese: "今晚花园里有点暗。", vocabulary: ["evening"] },
      { roleId: "mia", english: "How will we see our picnic?", chinese: "我们怎么看清野餐呢？" },
      { roleId: "grandma", english: "We can solve this together.", chinese: "我们可以一起解决。" },
      { roleId: "dad", english: "Let us hang a lantern in the tree.", chinese: "我们在树上挂一盏灯笼吧。", vocabulary: ["lantern"] },
      { roleId: "mia", english: "We can spread the blanket here.", chinese: "我们可以把毯子铺在这里。", vocabulary: ["blanket"] },
      { roleId: "grandma", english: "I will bring the plates outside.", chinese: "我把盘子拿到外面来。" },
      { roleId: "dad", english: "I will light the little lantern.", chinese: "我来点亮小灯笼。" },
      { roleId: "mia", english: "I will make paper stars.", chinese: "我来做纸星星。" },
      { roleId: "grandma", english: "Now the garden feels bright.", chinese: "现在花园里亮起来了。" },
      { roleId: "dad", english: "Please share the fruit, Mia.", chinese: "米娅，请分享水果。", vocabulary: ["share"] },
      { roleId: "mia", english: "Here you are. Help yourself!", chinese: "给你。请随便吃！" },
      { roleId: "grandma", english: "This is a wonderful picnic.", chinese: "这是一次很棒的野餐。" },
      { roleId: "dad", english: "Moonlight makes our picnic magical.", chinese: "月光让我们的野餐充满魔法。" },
      { roleId: "mia", english: "We can solve this together!", chinese: "我们可以一起解决！" },
    ],
    challenges: [
      { prompt: "Why is the garden hard to see?", options: ["It is dark", "It is raining", "It is crowded"], answerIndex: 0, encouragement: "Great listening!" },
      { prompt: "Where do they hang the lantern?", options: ["In a tree", "In the car", "At school"], answerIndex: 0, encouragement: "Wonderful work!" },
      { prompt: "What does Mia make?", options: ["Paper stars", "A cake", "A kite"], answerIndex: 0, encouragement: "You remembered it!" },
    ],
  },
  {
    id: "missing-lunchbox", title: "The Missing Lunchbox", chineseTitle: "消失的午餐盒", category: "school", minutes: 10, level: "Elementary",
    vocabulary: { lunchbox: "午餐盒", missing: "不见的", classroom: "教室", check: "检查", library: "图书馆", borrow: "借用", label: "标签", found: "找到了" },
    roles: [
      { id: "leo", name: "Leo", emoji: "🧒", childFriendly: true },
      { id: "teacher", name: "Ms. Lee", emoji: "👩‍🏫", childFriendly: false },
      { id: "sam", name: "Sam", emoji: "🧑", childFriendly: false },
    ],
    lines: [
      { roleId: "leo", english: "It is time for lunch.", chinese: "午餐时间到了。", pronunciation: "lunch: LUNCH（与中文“浪”开头相近）" },
      { roleId: "sam", english: "I have rice and carrots.", chinese: "我有米饭和胡萝卜。" },
      { roleId: "leo", english: "My lunchbox is missing!", chinese: "我的午餐盒不见了！", vocabulary: ["lunchbox", "missing"] },
      { roleId: "teacher", english: "Stay calm, Leo.", chinese: "冷静点，利奥。" },
      { roleId: "teacher", english: "Let us retrace your steps.", chinese: "我们沿路找一找吧。" },
      { roleId: "sam", english: "First, check the classroom.", chinese: "先检查教室。", vocabulary: ["check", "classroom"] },
      { roleId: "leo", english: "It is not under my desk.", chinese: "它不在我的课桌下面。" },
      { roleId: "teacher", english: "Where did you go this morning?", chinese: "你今天早上去了哪里？" },
      { roleId: "leo", english: "I went to the library.", chinese: "我去了图书馆。", vocabulary: ["library"] },
      { roleId: "sam", english: "I can look by the bookshelf.", chinese: "我可以去书架旁找。" },
      { roleId: "teacher", english: "I will ask the librarian.", chinese: "我去问图书管理员。" },
      { roleId: "leo", english: "Thank you for helping me.", chinese: "谢谢你们帮助我。" },
      { roleId: "sam", english: "Is this blue box yours?", chinese: "这个蓝盒子是你的吗？" },
      { roleId: "leo", english: "Yes! My name is on the label.", chinese: "是的！标签上有我的名字。", vocabulary: ["label"] },
      { roleId: "teacher", english: "We found the lunchbox.", chinese: "我们找到午餐盒了。", vocabulary: ["found"] },
      { roleId: "sam", english: "You may borrow my spoon.", chinese: "你可以借我的勺子。", vocabulary: ["borrow"] },
      { roleId: "leo", english: "That is very kind of you.", chinese: "你真友善。" },
      { roleId: "teacher", english: "Asking for help is a smart choice.", chinese: "寻求帮助是聪明的选择。" },
    ],
    challenges: [
      { prompt: "What is missing?", options: ["A book", "A lunchbox", "A coat"], answerIndex: 1, encouragement: "Exactly right!" },
      { prompt: "Where did Leo go?", options: ["The library", "The park", "The shop"], answerIndex: 0, encouragement: "Good memory!" },
      { prompt: "How do they know the box is Leo's?", options: ["It is open", "It has a label", "It is heavy"], answerIndex: 1, encouragement: "Excellent clue finding!" },
    ],
  },
  {
    id: "secret-tree-house", title: "The Secret Tree House", chineseTitle: "秘密树屋", category: "fantasy", minutes: 12, level: "Elementary",
    vocabulary: { secret: "秘密", tree: "树", ladder: "梯子", map: "地图", key: "钥匙", window: "窗户", brave: "勇敢的", together: "一起" },
    roles: [
      { id: "lily", name: "Lily", emoji: "🧚", childFriendly: true },
      { id: "dragon", name: "Pip the Dragon", emoji: "🐉", childFriendly: false },
      { id: "owl", name: "Wise Owl", emoji: "🦉", childFriendly: false },
    ],
    lines: [
      { roleId: "lily", english: "There is a secret path in the forest.", chinese: "森林里有一条秘密小路。", vocabulary: ["secret"], pronunciation: "secret: SEE-krit（重音在 SEE）" },
      { roleId: "owl", english: "Look up at the old tree.", chinese: "抬头看看那棵老树。", vocabulary: ["tree"] },
      { roleId: "dragon", english: "I found a wooden ladder.", chinese: "我发现了一架木梯。", vocabulary: ["ladder"] },
      { roleId: "lily", english: "It leads to a secret tree house.", chinese: "它通向一间秘密树屋。" },
      { roleId: "dragon", english: "The door is locked.", chinese: "门锁住了。" },
      { roleId: "owl", english: "This map may show the key.", chinese: "这张地图也许标出了钥匙。", vocabulary: ["map", "key"] },
      { roleId: "dragon", english: "The mark is beside a round window.", chinese: "标记在圆窗旁边。", vocabulary: ["window"] },
      { roleId: "lily", english: "We will search together.", chinese: "我们一起找。", vocabulary: ["together"] },
      { roleId: "owl", english: "Check under the flower pot.", chinese: "看看花盆下面。" },
      { roleId: "dragon", english: "Here is the tiny silver key!", chinese: "小银钥匙在这里！" },
      { roleId: "lily", english: "The floor creaks inside.", chinese: "里面的地板吱吱响。" },
      { roleId: "owl", english: "Step carefully on the strong boards.", chinese: "小心踩结实的木板。" },
      { roleId: "dragon", english: "I can hold the lantern.", chinese: "我可以拿着灯。" },
      { roleId: "lily", english: "I can open the dusty chest.", chinese: "我可以打开落灰的箱子。" },
      { roleId: "owl", english: "It is full of storybooks.", chinese: "里面装满了故事书。" },
      { roleId: "dragon", english: "I climbed up. I feel brave!", chinese: "我爬上来了。我觉得很勇敢！", vocabulary: ["brave"] },
      { roleId: "lily", english: "We found a perfect reading place.", chinese: "我们找到了完美的阅读角。" },
      { roleId: "dragon", english: "The secret tree house belongs to all of us.", chinese: "这间秘密树屋属于我们大家。" },
    ],
    challenges: [
      { prompt: "What leads to the tree house?", options: ["A ladder", "A bridge", "A train"], answerIndex: 0, encouragement: "Great job!" },
      { prompt: "Where is the key?", options: ["Under a flower pot", "In a shoe", "By a river"], answerIndex: 0, encouragement: "You found the secret!" },
      { prompt: "What is in the chest?", options: ["Story books", "Stones", "Leaves"], answerIndex: 0, encouragement: "Brilliant teamwork!" },
    ],
  },
  {
    id: "busy-morning", title: "A Busy Morning", chineseTitle: "忙碌的早晨", category: "family", minutes: 10, level: "Elementary",
    vocabulary: { morning: "早晨", breakfast: "早餐", hurry: "赶快", backpack: "书包", toast: "吐司", ready: "准备好的", share: "分担", together: "一起" },
    roles: [
      { id: "zoe", name: "Zoe", emoji: "👧", childFriendly: true },
      { id: "mom", name: "Mom", emoji: "👩", childFriendly: false },
      { id: "uncle", name: "Uncle Ben", emoji: "👨", childFriendly: false },
    ],
    lines: [
      { roleId: "zoe", english: "What a busy morning!", chinese: "真是个忙碌的早晨！", vocabulary: ["morning"], pronunciation: "morning: MOR-ning（重音在 MOR）" },
      { roleId: "mom", english: "We have twenty minutes to get ready.", chinese: "我们有二十分钟准备好。", vocabulary: ["ready"] },
      { roleId: "uncle", english: "I will make breakfast.", chinese: "我来做早餐。", vocabulary: ["breakfast"] },
      { roleId: "zoe", english: "I can pack my backpack.", chinese: "我可以收拾书包。", vocabulary: ["backpack"] },
      { roleId: "mom", english: "Please feed the cat first.", chinese: "请先喂猫。" },
      { roleId: "uncle", english: "Oh! The toast is getting dark.", chinese: "糟糕！吐司要焦了。", vocabulary: ["toast"] },
      { roleId: "zoe", english: "I will turn off the toaster.", chinese: "我来关掉烤面包机。" },
      { roleId: "mom", english: "That is quick thinking.", chinese: "反应真快。" },
      { roleId: "uncle", english: "Can you share the morning jobs?", chinese: "你能分担早晨的任务吗？", vocabulary: ["share"] },
      { roleId: "zoe", english: "I will fill the water bottles.", chinese: "我来装满水瓶。" },
      { roleId: "mom", english: "I will find your shoes.", chinese: "我来找你的鞋。" },
      { roleId: "uncle", english: "Breakfast is ready now.", chinese: "早餐准备好了。" },
      { roleId: "mom", english: "Hurry, but walk carefully.", chinese: "赶快，但要小心走。", vocabulary: ["hurry"] },
      { roleId: "zoe", english: "My backpack is by the door.", chinese: "我的书包在门边。" },
      { roleId: "uncle", english: "Here are apples for the road.", chinese: "这里有路上吃的苹果。" },
      { roleId: "mom", english: "We finished every little job.", chinese: "每件小事都完成了。" },
      { roleId: "zoe", english: "Everyone helped this morning.", chinese: "今天早晨每个人都帮忙了。" },
      { roleId: "uncle", english: "Together, busy mornings feel easy.", chinese: "一起合作，忙碌的早晨也会变轻松。", vocabulary: ["together"] },
    ],
    challenges: [
      { prompt: "How much time does the family have?", options: ["Twenty minutes", "Two hours", "Five minutes"], answerIndex: 0, encouragement: "Correct!" },
      { prompt: "What gets too dark?", options: ["The toast", "The sky", "A coat"], answerIndex: 0, encouragement: "Sharp listening!" },
      { prompt: "Where is Zoe's backpack?", options: ["By the door", "Under the bed", "At school"], answerIndex: 0, encouragement: "Great teamwork!" },
    ],
  },
  {
    id: "class-talent-show", title: "The Class Talent Show", chineseTitle: "班级才艺秀", category: "school", minutes: 12, level: "Elementary",
    vocabulary: { talent: "才艺", stage: "舞台", practice: "练习", nervous: "紧张的", costume: "服装", applause: "掌声", perform: "表演", together: "一起" },
    roles: [
      { id: "ava", name: "Ava", emoji: "👧", childFriendly: true },
      { id: "mrchen", name: "Mr. Chen", emoji: "👨‍🏫", childFriendly: false },
      { id: "noah", name: "Noah", emoji: "🧒", childFriendly: false },
    ],
    lines: [
      { roleId: "ava", english: "Today is our class talent show!", chinese: "今天是班级才艺秀！", vocabulary: ["talent"], pronunciation: "talent: TAL-ent（重音在 TAL）" },
      { roleId: "noah", english: "The stage looks bright.", chinese: "舞台看起来真明亮。", vocabulary: ["stage"] },
      { roleId: "mrchen", english: "Everyone has time to practice.", chinese: "每个人都有时间练习。", vocabulary: ["practice"] },
      { roleId: "ava", english: "I will sing an English song.", chinese: "我要唱一首英文歌。" },
      { roleId: "mrchen", english: "Take a slow breath before you perform.", chinese: "表演前慢慢吸一口气。", vocabulary: ["perform"] },
      { roleId: "noah", english: "I am nervous about my magic trick.", chinese: "我对魔术表演有点紧张。", vocabulary: ["nervous"] },
      { roleId: "ava", english: "We can practice it together.", chinese: "我们可以一起练习。", vocabulary: ["together"] },
      { roleId: "mrchen", english: "Your costume is behind the curtain.", chinese: "你的服装在幕布后面。", vocabulary: ["costume"] },
      { roleId: "noah", english: "Oh no, my magic hat is empty.", chinese: "糟糕，我的魔术帽是空的。" },
      { roleId: "ava", english: "Use this paper flower instead.", chinese: "改用这朵纸花吧。" },
      { roleId: "mrchen", english: "That is a creative solution.", chinese: "这是个有创意的办法。" },
      { roleId: "noah", english: "The paper flower looks magical.", chinese: "纸花看起来很神奇。" },
      { roleId: "ava", english: "It is our turn on stage.", chinese: "轮到我们上台了。" },
      { roleId: "mrchen", english: "Smile and enjoy the show.", chinese: "微笑并享受演出吧。" },
      { roleId: "noah", english: "The flower appeared!", chinese: "纸花出现了！" },
      { roleId: "ava", english: "Now I will sing my song.", chinese: "现在我要唱歌了。" },
      { roleId: "mrchen", english: "Listen to that applause.", chinese: "听听那些掌声。", vocabulary: ["applause"] },
      { roleId: "ava", english: "Our class has so many talents!", chinese: "我们班有这么多才艺！" },
    ],
    challenges: [
      { prompt: "What will Ava do?", options: ["Sing a song", "Bake a cake", "Paint a wall"], answerIndex: 0, encouragement: "Well spotted!" },
      { prompt: "Why is Noah nervous?", options: ["His magic trick", "A test", "A race"], answerIndex: 0, encouragement: "Excellent listening!" },
      { prompt: "What appears from the hat?", options: ["A paper flower", "A snack", "A ball"], answerIndex: 0, encouragement: "You solved it!" },
    ],
  },
  {
    id: "cloud-postman", title: "The Cloud Postman", chineseTitle: "云朵邮差", category: "fantasy", minutes: 12, level: "Elementary",
    vocabulary: { cloud: "云", postman: "邮差", letter: "信", address: "地址", storm: "暴风雨", feather: "羽毛", deliver: "递送", promise: "承诺" },
    roles: [
      { id: "ruby", name: "Ruby", emoji: "👧", childFriendly: true },
      { id: "giant", name: "Cloud Giant", emoji: "☁️", childFriendly: false },
      { id: "bird", name: "Sky Bird", emoji: "🦜", childFriendly: false },
    ],
    lines: [
      { roleId: "ruby", english: "A silver cloud is beside my window.", chinese: "一朵银色的云在我窗边。", vocabulary: ["cloud"], pronunciation: "cloud: CLOUD（一个音节，嘴形从 a 滑向 oo）" },
      { roleId: "bird", english: "Climb on! The postman needs you.", chinese: "爬上来！邮差需要你。", vocabulary: ["postman"] },
      { roleId: "giant", english: "Welcome to the cloud post office.", chinese: "欢迎来到云朵邮局。" },
      { roleId: "ruby", english: "Why are these letters still here?", chinese: "这些信为什么还在这里？", vocabulary: ["letter"] },
      { roleId: "giant", english: "A storm is coming fast.", chinese: "暴风雨正快速来临。", vocabulary: ["storm"] },
      { roleId: "bird", english: "One letter has no clear address.", chinese: "有一封信的地址看不清。", vocabulary: ["address"] },
      { roleId: "ruby", english: "We must deliver it before the rain.", chinese: "我们得在下雨前送到。", vocabulary: ["deliver"] },
      { roleId: "giant", english: "The parcel is too heavy for my cloud.", chinese: "包裹对我的云来说太重了。" },
      { roleId: "bird", english: "My feathers can point the way.", chinese: "我的羽毛可以指路。", vocabulary: ["feather"] },
      { roleId: "ruby", english: "The drawing shows a blue windmill.", chinese: "图画上有一座蓝色风车。" },
      { roleId: "giant", english: "I can carry the parcel slowly.", chinese: "我可以慢慢搬包裹。" },
      { roleId: "bird", english: "I will fly ahead and find the windmill.", chinese: "我先飞去找风车。" },
      { roleId: "ruby", english: "Follow the bright feather!", chinese: "跟着亮闪闪的羽毛！" },
      { roleId: "giant", english: "There is the blue windmill.", chinese: "蓝色风车在那里。" },
      { roleId: "bird", english: "The storm is passing below us.", chinese: "暴风雨正从我们下方经过。" },
      { roleId: "ruby", english: "We delivered the last letter safely.", chinese: "我们安全送到了最后一封信。" },
      { roleId: "giant", english: "Promise you will help again.", chinese: "答应我还会再来帮忙。", vocabulary: ["promise"] },
      { roleId: "ruby", english: "I promise. Cloud mail always gets through.", chinese: "我答应。云朵邮件总会送到。" },
    ],
    challenges: [
      { prompt: "What is coming?", options: ["A storm", "A train", "A dragon"], answerIndex: 0, encouragement: "Right on!" },
      { prompt: "What is unclear on the letter?", options: ["The address", "The color", "The stamp"], answerIndex: 0, encouragement: "Great listening!" },
      { prompt: "What landmark do they find?", options: ["A blue windmill", "A red bridge", "A green tower"], answerIndex: 0, encouragement: "Fantastic teamwork!" },
    ],
  },
];

const curatedPatterns: Record<string, Array<Omit<SentencePattern, "commonMistake" | "correction">>> = {
  "moonlight-picnic": [
    { title: "提出一起做的建议", purpose: "邀请家人一起行动。", example: "Let us pack the basket.", template: "Let us + 动作 + 物品", substitutions: ["pack", "share", "hang"], grammarTip: "Let us 后面的动作词用原形。口语里常说 Let’s。", tasks: ["邀请家人一起收拾桌子。", "邀请家人一起分享水果。"] },
    { title: "说出自己将要做什么", purpose: "主动承担一个家庭任务。", example: "I will make paper stars.", template: "I will + 动作 + 物品", substitutions: ["make", "bring", "light"], grammarTip: "will 后面的动作词不加 s，也不加 ing。", tasks: ["说一件你晚饭后会做的事。", "换一个故事物品再说一遍。"] },
  ],
  "missing-lunchbox": [
    { title: "描述东西在哪里", purpose: "寻找物品时说清位置。", example: "It is not under my desk.", template: "It is / is not + 位置词 + 地点", substitutions: ["under", "on", "beside"], grammarTip: "is not 表示不在；位置词放在地点前面。", tasks: ["说出书包不在哪里。", "说出铅笔在哪里。"] },
    { title: "询问过去去了哪里", purpose: "回忆路线并寻找线索。", example: "Where did you go this morning?", template: "Where did + 人物 + go + 时间?", substitutions: ["this morning", "after class", "at lunch"], grammarTip: "用了 did，后面的 go 保持原形。", tasks: ["问家长今天早上去了哪里。", "用 after class 再问一次。"] },
  ],
  "secret-tree-house": [
    { title: "介绍某处有什么", purpose: "带家人发现新的地方。", example: "There is a secret path in the forest.", template: "There is + 一个东西 + 地点", substitutions: ["a path", "a ladder", "a key"], grammarTip: "介绍一个东西用 There is。", tasks: ["说房间里有一张桌子。", "说树下有一把钥匙。"] },
    { title: "表达能做什么", purpose: "在冒险中主动提供帮助。", example: "I can hold the lantern.", template: "I can + 动作 + 物品", substitutions: ["hold", "open", "search"], grammarTip: "can 后面直接接动作原形。", tasks: ["说一件你能帮家人做的事。", "用 open 或 search 造句。"] },
  ],
  "busy-morning": [
    { title: "礼貌请别人先做某事", purpose: "安排忙碌早晨的顺序。", example: "Please feed the cat first.", template: "Please + 动作 + 物品 + first", substitutions: ["feed", "pack", "find"], grammarTip: "Please 放句首让请求更礼貌；first 表示先做。", tasks: ["请家长先找鞋子。", "请自己先收拾书包。"] },
    { title: "主动分担任务", purpose: "告诉家人自己愿意做什么。", example: "I will fill the water bottles.", template: "I will + 动作 + 物品", substitutions: ["fill", "pack", "turn off"], grammarTip: "will 表示接下来愿意或准备做。", tasks: ["说你会准备什么早餐。", "说你会关掉什么电器。"] },
  ],
  "class-talent-show": [
    { title: "表达紧张或开心", purpose: "在表演前说出自己的感受。", example: "I am nervous about my magic trick.", template: "I am + 感受 + about + 事情", substitutions: ["nervous", "happy", "excited"], grammarTip: "I 后面用 am；about 后面说让你产生感受的事情。", tasks: ["说你对英语表演的感受。", "换成 excited 再说一次。"] },
    { title: "用建议解决问题", purpose: "当道具出问题时提出替代办法。", example: "Use this paper flower instead.", template: "Use + 替代物 + instead", substitutions: ["a paper flower", "this hat", "that song"], grammarTip: "instead 表示改用另一个办法，常放在句尾。", tasks: ["为丢失的铅笔提出替代办法。", "为忘记的歌词提出替代办法。"] },
  ],
  "cloud-postman": [
    { title: "说明必须完成的任务", purpose: "在紧急任务中说清目标。", example: "We must deliver it before the rain.", template: "We must + 动作 + before + 时间或事件", substitutions: ["deliver", "find", "finish"], grammarTip: "must 后面用动作原形，表示必须做。", tasks: ["说下雨前必须做什么。", "说睡觉前必须完成什么。"] },
    { title: "解释东西太怎么样", purpose: "说明遇到的困难。", example: "The parcel is too heavy for my cloud.", template: "东西 + is too + 形容词 + for + 对象", substitutions: ["heavy", "fast", "far"], grammarTip: "too 表示超过合适程度，不只是“很”。", tasks: ["说一个盒子太重了。", "用 fast 或 far 描述困难。"] },
  ],
};

const grammarCorrections: Record<string, Array<[string, string]>> = {
  "moonlight-picnic": [["Let us packs the basket.", "Let us pack the basket."], ["I will makes paper stars.", "I will make paper stars."]],
  "missing-lunchbox": [["It are not under my desk.", "It is not under my desk."], ["Where did you went this morning?", "Where did you go this morning?"]],
  "secret-tree-house": [["There are a secret path in the forest.", "There is a secret path in the forest."], ["I can opens the dusty chest.", "I can open the dusty chest."]],
  "busy-morning": [["Please feeds the cat first.", "Please feed the cat first."], ["I will filling the water bottles.", "I will fill the water bottles."]],
  "class-talent-show": [["I is nervous about my magic trick.", "I am nervous about my magic trick."], ["Use instead this paper flower.", "Use this paper flower instead."]],
  "cloud-postman": [["We must delivers it before the rain.", "We must deliver it before the rain."], ["The parcel is too heavy to my cloud.", "The parcel is too heavy for my cloud."]],
};

const curatedRetells: Record<string, RetellPlan> = {
  "moonlight-picnic": { settingHint: "garden · evening · picnic", problemHint: "dark · cannot see", actionHints: ["hang a lantern", "spread the blanket"], endingHint: "bright · magical picnic" },
  "missing-lunchbox": { settingHint: "school · lunchtime", problemHint: "lunchbox · missing", actionHints: ["retrace the steps", "check the library"], endingHint: "find the label · found" },
  "secret-tree-house": { settingHint: "forest · old tree", problemHint: "door · locked", actionHints: ["follow the map", "find the silver key"], endingHint: "storybooks · reading place" },
  "busy-morning": { settingHint: "home · busy morning", problemHint: "twenty minutes · toast", actionHints: ["share the jobs", "pack and get ready"], endingHint: "everyone helps · ready" },
  "class-talent-show": { settingHint: "class · talent show", problemHint: "nervous · empty hat", actionHints: ["practice together", "use a paper flower"], endingHint: "sing · applause" },
  "cloud-postman": { settingHint: "cloud post office", problemHint: "storm · unclear address", actionHints: ["follow the feather", "find the blue windmill"], endingHint: "deliver the letter safely" },
};

const stageDirections: Record<string, Record<number, string>> = {
  "moonlight-picnic": { 0: "兴奋地举起野餐篮", 5: "看看四周，表现出担心", 11: "假装剪出一颗纸星星", 17: "和家人击掌" },
  "missing-lunchbox": { 2: "翻找书包，着急地说", 7: "一边回想一边提问", 13: "指着盒子上的名字", 17: "微笑着点头" },
  "secret-tree-house": { 0: "压低声音，神秘地说", 4: "轻轻推一推门", 10: "踮起脚，小心向前", 17: "张开双臂介绍树屋" },
  "busy-morning": { 0: "看一眼时钟", 5: "闻到焦味，惊讶地说", 9: "假装往水瓶里倒水", 17: "和家人击掌" },
  "class-talent-show": { 0: "兴奋地指向舞台", 5: "深呼吸，手微微发抖", 9: "把纸花递给同伴", 17: "一起鞠躬谢幕" },
  "cloud-postman": { 0: "望向窗外的云", 4: "指向远处的暴风雨", 12: "举起一根想象的羽毛", 17: "向云朵朋友挥手" },
};

function createLearningPack(story: Omit<Story, "learningPack">, index: number): LearningPack {
  const vocabulary = Object.entries(story.vocabulary);
  const words = vocabulary.map(([word, meaning]) => ({ word, meaning, pronunciation: pronunciationCues[word], review: false, example: story.lines.find((line) => line.vocabulary?.includes(word))?.english ?? `I can use ${word}.` }));
  const reviewSources = index > 0 ? storyCatalog.slice(0, index).reverse().slice(0, 3) : [story];
  const usedReviewWords = new Set<string>();
  const reviewWords = Array.from({ length: 3 }, (_, reviewIndex) => {
    const source = reviewSources[reviewIndex % reviewSources.length];
    const entries = Object.entries(source.vocabulary);
    let entryIndex = (index * 2 + reviewIndex * 3) % entries.length;
    while (usedReviewWords.has(entries[entryIndex][0])) entryIndex = (entryIndex + 1) % entries.length;
    const [word, meaning] = entries[entryIndex];
    usedReviewWords.add(word);
    return { word, meaning, pronunciation: pronunciationCues[word], review: true, example: `Can you use ${word} in a new sentence?`, sourceStory: source.chineseTitle };
  });
  const patterns = curatedPatterns[story.id].map((pattern, patternIndex) => ({ ...pattern, commonMistake: grammarCorrections[story.id][patternIndex][0], correction: grammarCorrections[story.id][patternIndex][1] }));
  return {
    words,
    reviewWords,
    patterns,
    speakingChallenges: [
      { prompt: "不看剧本，说出故事开始发生了什么。", hint: story.lines[0].english },
      { prompt: "用今天的句型向家人提出一个建议。", hint: patterns[1].template },
      { prompt: "选择两个重点词，编一句新的台词。", hint: words.slice(0, 2).map(({ word }) => word).join(" + ") },
    ],
    retell: curatedRetells[story.id],
    parentPrompts: ["先说中文，请孩子说英文。", "只给首字母，再让孩子补完整词。", "请孩子换一个人物或动作造新句。"],
  };
}

export const stories: Story[] = storyCatalog.map((story, index) => {
  const directedStory = { ...story, lines: story.lines.map((line, lineIndex) => ({ ...line, stageDirection: stageDirections[story.id][lineIndex] })) };
  return { ...directedStory, learningPack: createLearningPack(directedStory, index) };
});
