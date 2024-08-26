export const GAME_TIME = parseInt(process.env.NEXT_PUBLIC_GAME_TIME as string);
export const GAME_MOVEMENT = parseInt(process.env.NEXT_PUBLIC_GAME_MOVEMENT as string);

export const ALERT_MESSAGES = {
    win: {
      title: "آفرین بهت باهوش !",
      text: "تونستی همه کارت هارو درست حدس بزنی ، نظرت چیه یه دست دیگه بازی کنیم ؟",
      icon: "success"
    },
    noMoves: {
      title: "باختی !",
      text: "قبل اینکه همه کارت هارو حدس بزنی حرکت هات تموم شد",
      icon: "error"
    },
    timeOut: {
      title: "باختی !",
      text: "قبل اینکه همه کارت هارو حدس بزنی زمانت تموم شد",
      icon: "error"
    }
  };
  