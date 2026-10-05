/*
  ============================================================
  EDIT THIS FILE for copy, meme links, card art, and custom sounds.
  ============================================================
*/

const SITE_CONFIG = {
  herName: "wife",

  ask: {
    introTitle: "herro wife?  Hibachi, Benihana, Teriyaki",
    introSubtitle: "can i ask u somethin",
    introButton: "sup?",
    question: "can i take you out on a date :>",
    yesText: "yasssss",

    // Same hover-background jokes as the first ZIP. No hover audio.
    hoverYesBackground: "https://media1.tenor.com/m/uFkKfNv-8wsAAAAd/vince-carter-emotional-vince-carter.gif",
    hoverNoBackground: "https://media1.tenor.com/m/T2g9DmDlZZEAAAAd/crying-lebron-james.gif"
  },

  // The button changes text as it slowly dodges the cursor.
  noSequence: [
    "no",
    "noooo",
    "pls",
    "beda",
    "oh helll naaa",
    "chungus fool go da"
  ],

  backgrounds: {
    // intro is a local MP4 handled separately in script.js
    ask: "https://i.pinimg.com/originals/a3/10/29/a31029140fd97696b96f9f4e5cdfc681.gif",
    retry: "https://media1.tenor.com/m/8A2dktAA-XMAAAAd/interstellar-crying.gif",
    celebrate: "https://media.tenor.com/mtiOW6O-k8YAAAAM/shrek-shrek-rizz.gif",
    dates: "",
    final: ""
  },

  // These are copied from the first ZIP you shared.
  backgroundSequences: {
    retry: {
      interval: 2000,
      items: [
        "https://media1.tenor.com/m/8A2dktAA-XMAAAAd/interstellar-crying.gif",
        "https://media1.tenor.com/m/T2g9DmDlZZEAAAAd/crying-lebron-james.gif",
        "https://media.tenor.com/K_xU5ytFNoYAAAAM/crying-boy.gif",
        "https://media.tenor.com/GIQybzxRoNIAAAAM/very-sad-hampter-huhu.gif",
        "https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/10223953/sadspongebob.gif?quality=90&strip=all&crop=0,11.200448765894,100,77.599102468212"
      ]
    },
    celebrate: {
      interval: 3000,
      items: [
        "https://media.tenor.com/mtiOW6O-k8YAAAAM/shrek-shrek-rizz.gif",
        "https://i.pinimg.com/originals/17/78/bd/1778bd3bc3371e66373857531d78c2a2.gif",
        "https://img.resized.co/balls_ie/eyJkYXRhIjoie1widXJsXCI6XCJodHRwczpcXFwvXFxcL21lZGlhLmJhbGxzLmllXFxcL3VwbG9hZHNcXFwvMjAxNFxcXC8wNlxcXC9IZXJyZXJhLTQuZ2lmXCIsXCJ3aWR0aFwiOlwiNjQwXCIsXCJoZWlnaHRcIjpcIjM2MFwiLFwiZGVmYXVsdFwiOlwiaHR0cHM6XFxcL1xcXC93d3cuYmFsbHMuaWVcXFwvaW1hZ2VzXFxcL2JyYW5kLWltYWdlLmpwZ1wiLFwib3B0aW9uc1wiOntcIm91dHB1dFwiOlwiYXZpZlwiLFwicXVhbGl0eVwiOjU1fX0iLCJoYXNoIjoiYTM4NThmYmE2YjQ5OWQ0YTcyOTQ0ZjIzNDQ2YjNjYTZjZmRlM2RiYSJ9/farewell-dear-friend-top-7-gifs-of-insane-mexico-manager-miguel-herrera.gif",
        "https://64.media.tumblr.com/6f951737d824f9643b4f07381e319e99/tumblr_pgv0h713UC1u2klrwo1_400.gif",
        "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWE5djFmcWMwZDBlYmp5aGozMHp5N3VqenVhM2w0aWEzaHQ4aWk0dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8Z90kobwGL7CaCAAaB/giphy.gif"
      ]
    }
  },

  memes: [
    // Add the shared brainrot stickers here later.
  ],

  sounds: {
    // Intro track + click-only choice sounds.
    intro: "assets/sounds/hoa_hoa.mp3",
    no: "assets/sounds/no.mp3",
    yes: "assets/sounds/yes.mp3",
    sopar: "assets/sounds/sopar.mp3"
  },

  dates: [
    {
      id: "rage-room",
      title: "DESTROY THINGS, MY QUEEN",
      shortTitle: "Rage Room",
      theme: "rage",
      image: "assets/images/rage-throne.png",
      body: "We go to a rage room and you can take out all the rage that's fitting in that cutu body of yours. You can beat me up also if you want (#rightwhereiwantobe). Then spicy ramen later and your fav ice cream at Milano.",
      tag: "warning: extremely attractive violence"
    },
    {
      id: "aquarium",
      title: "FISHIES, JELLYFISHIES & ME",
      shortTitle: "Aquarium",
      theme: "aquarium",
      image: "assets/images/date-aquarium.jpg",
      body: "We go to an aquarium and see as many fishies and turtles and jellyfishes as you want. Plus factor: we could kiss in front of the fishes to make them jealous. Then some BOMB food later and I get to hear you yap yap yap.",
      tag: "the fish WILL be jealous"
    },
    {
      id: "dosa-hunt",
      title: "OPERATION: CRISPY DOSA",
      shortTitle: "Dosa Hunt",
      theme: "dosa",
      image: "assets/images/date-dosa.jpg",
      body: "We go to Jayanagar and hit ALL your fav dosa spots. You give your expert culinary rating and review, we stop for hot chocolate and some shopping. Plus point: I could hold your hand the entire time because they might steal you.",
      tag: "food critic gf mode activated"
    },
    {
      id: "coffee",
      title: "AYY CHILL DA",
      shortTitle: "Coffee + Hot Chocolate",
      theme: "coffee",
      image: "assets/images/date-coffee.jpg",
      body: "Ayy chill da. We grab coffee and hot chocolate wherever you want, and I get to listen to you yap. Plus point because I love your voice.",
      tag: "maximum yapping encouraged"
    },
    {
      id: "movie",
      title: "SCARED? ME? NEVER.",
      shortTitle: "Horror Movie",
      theme: "movie",
      image: "assets/images/date-horror.jpg",
      body: "WE GO WATCH A HORROR MOVIE. I buy you all the caramel popcorn your small mouth can eat. If I get scared I will need a kissy tho. If no horror movie is showing, any movie works. I still will need a kissy because I'll pretend to get scared.",
      tag: "totally not a kiss strategy"
    },
    {
      id: "museum",
      title: "CULTURE BUT MAKE IT DUMB",
      shortTitle: "Museum",
      theme: "museum",
      image: "assets/images/date-museum.jpg",
      body: "We go to a museum and you can cook up fake meanings of everything we see and I 100% believe you. I steal one art piece as I leave (you), then lunch and something sweet.",
      tag: "intellectual fraud but romantic"
    },
    {
      id: "maya-bazaar",
      title: "MAYA BAZAAR SIDE QUEST",
      shortTitle: "Maya Bazaar",
      theme: "bazaar",
      image: "assets/images/date-maya.jpg",
      body: "We go to Maya Bazaar and go shopping, eating and yapping. Plus point: I get to hold your hand because I don't want you to get lost in the crowd.",
      tag: "crowd-control boyfriend services included"
    },
    {
      id: "arcade",
      title: "PLAYER 1 VS PLAYER 2",
      shortTitle: "Arcade",
      theme: "arcade",
      image: "assets/images/date-arcade.jpg",
      body: "We go to an arcade and you beat me in every game we play. I won't let you win though, I'm very competitive. Loser gets kisses hehe. Then pizza and some mad new dessert place.",
      tag: "loser gets kisses. winner somehow also gets kisses."
    },
    {
      id: "her-choice",
      title: "WIFE'S CHOICE",
      shortTitle: "You Plan It",
      theme: "wildcard",
      image: "assets/images/date-wife-choice.jpg",
      body: "Ayy I want to plan the date. I don't like any of these chungus ahh ideas. I have a much better idea. #wifeisalwaysright #whateveryouwantmaam #imrightwhereiwanttobe",
      tag: "the correct option by constitutional law"
    }
  ]
};
