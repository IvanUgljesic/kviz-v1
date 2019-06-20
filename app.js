// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAOOowkfVL6MonQap3K6LpQUfhoeN1KsTs",
    authDomain: "kviz-10ac8.firebaseapp.com",
    databaseURL: "https://kviz-10ac8.firebaseio.com",
    projectId: "kviz-10ac8",
    storageBucket: "kviz-10ac8.appspot.com",
    messagingSenderId: "939143697730",
    appId: "1:939143697730:web:895b34e0339afb9d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  var messagesRef = firebase.database().ref('messages');

new Vue({
  el:'#app',
  data:{
    oblasti:{
    istorija:'Istorija je društvena i humanistička nauka koja istražuje i proučava prošlost ljudskog društva. Dobila je naziv po grčkoj reči historía, što znači „znanje stečeno slušanjem i raspitivanjem”.',
    muzika:'Muzika (lat. musica - grč. μουσιϰή [τέχνη]: muzičko [umeće]),umetnost čiji je medij zvuk kog organizujemo u vremenu, uglavnom po nekom planu i namerno, iako ima i drugih načina.',
    sport:'Sportom (iz latinskog deportare, odatle današnji sport i znači razonođenje, odmaranje, uživanje) se nazivaju takmičenja koja su najčešće u sferi fizičkih aktivnosti.',
    geografija:'Geografija (grč. γεωγραφία, od γῆ: zemlja + γράφεıν: pisati), znanost koja proučava prostornu stvarnost Zemljine površine, zemljopis.',
    knjizevnost:'Književnost, termin nastao od reči knjiga, predstavlja prevod strane reči literatura i njen je najbliži sinonim. Termin literatura potiče iz latinskog jezika od reči littera – slovo, nastao prevođenjem grčke reči sa istim značenjem γραμματικη (τεχνη) od γραμμα – slovo.',
    jezik:'Jezik je sistem gestikulacije, gramatike, znakova, glasova, simbola, ili reči, koji se koristi za prikaz i razmenu koncepata (tj., za komunikaciju), ideja, značenja i misli.',
    film:'Film je serija slika koje, kad se prikažu na platnu, stvaraju iluziju pokretanja zahvaljujući phi fenomenu. Ova optička iluzija čini da publika kontinuirano opaža pokret između odvojenih objekata koji se vide brzo u nastavcima.',
    srbija:'Srbija (službeno Republika Srbija), država locirana u jugoistočnoj Evropi (na Balkanskom poluostrvu) i u srednjoj Evropi (Panonskoj niziji). U sastavu Republike Srbije se nalaze i dve autonomne pokrajine Vojvodina i Kosovo i Metohija.'
    },
    showAll:{
      istorija:false,
      muzika:false,
      sport:false,
      geografija:false,
      knjizevnost:false,
      jezik:false,
      film:false,
      srbija:false
    },
    wiki:'https://sh.wikipedia.org/wiki/',
    oblastiSelect:[],
    pitanja:[],
    quizStartShow:false,
    quizIndexShow:true,
    questionCounter:0,
    nextQuestionTimer:'',
    timer:3,
    nextQuestionTimeShow:false,
    endQuizShow:false,
    timer1:10.00,
    questionTimer:'',
    osvojeniPoeni:0,
    oblast:'',
    scoreboard:'',
    sendMail:{
      senderEmail:'',
      senderMessage:''
    }
  },
  methods:{
    test(){
    },
    pocetna(){
      window.location.reload();
    },
    validationOff(){
      $('input[name="kontaktEmail"]').removeClass('is-invalid');
    },
    posaljiMail(){
      var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
      if(!this.sendMail.senderEmail.match(email_regex)){
        $('input[name="kontaktEmail"]').addClass(' is-invalid');
      }
      else {
        var newMessagesRef = messagesRef.push();
        newMessagesRef.set({
          senderEmail:this.sendMail.senderEmail,
          senderMessage:this.sendMail.senderMessage
        });
        window.location.reload();
        alert('Vaš mail je uspešno poslat!');
      }
    },
    highscore(){
      axios.get("api/scoreboard").then((response)=>{
        this.scoreboard=response.data.scoreboard;
      });
    },
    scoreExit(){
      window.location.href='./index.html';
    },
    scoreSave(){
      axios.post('api/scoreboard', {nick:$('input[name=nick]').val(),score:this.osvojeniPoeni});
      window.location.href='./index.html';
    },
    startOptions(){
      axios.get("api/oblasti").then((response)=>{
        this.oblastiSelect=response.data.oblasti;
      });
    },
    startQuiz(){
      var index=$('#inputState').find(':selected').val();
      this.oblast=this.oblastiSelect[index].kategorija;
      index++;
      axios.get("api/oblasti", {params: {izabranaOblast: index}}).then((response)=>{
      this.pitanja=response.data.pitanja;
      this.quizStartShow=true;
      this.quizIndexShow=false;
      this.timer1=10.0;
      this.questionTimer=setInterval(this.myTimer1, 100);
      window.location.href='#';
      });
    },
    answer(e){
      $(".btn-outline-secondary").prop("disabled",true);
      clearInterval(this.questionTimer);
      var temp=e;
      if(this.pitanja[this.questionCounter].tacanOdgovor==e.target.value){
        $('button[value="'+e.target.value+'"]').css({"background-color":"green", "color":"#fff",'box-shadow':'0 0 0 0.2rem rgba(0, 123, 255, 0.25)','outline': '0'});
        this.osvojeniPoeni+=Math.round(this.timer1*10);
      }
      else {
        $('button[value="'+e.target.value+'"]').css({"background-color": "#dc3545", "color":"#fff",'box-shadow':'0 0 0 0.2rem rgba(0, 123, 255, 0.25)','outline': '0'});
        $('button[value="'+this.pitanja[this.questionCounter].tacanOdgovor+'"]').css({"background-color": "green", "color":"#fff"});
      }
      this.timer=3;
      this.questionCounter==9 ? this.endQuizShow=true:this.nextQuestionTimeShow=true;
      this.nextQuestionTimer = setInterval(this.myTimer, 1000);
    
    },
    myTimer() {
        if(this.timer===0){
          this.myStopFunction();
          this.nextQuestionTimeShow=false;
          this.endQuizShow=false;
          $('button').removeAttr('style');
          $('button').css('box-shadow','none');
          $(".btn-outline-secondary").prop("disabled",false);
        }  
        this.timer--;
    },
    myTimer1() {
        this.timer1-=0.1;
        if(Math.round(this.timer1*100)/100===0.0){
          this.myStopFunction1();
        }
    },
    
    myStopFunction() {
        if(this.questionCounter<9){
          clearInterval(this.nextQuestionTimer);
          $( ".istekloVreme" ).remove();
          this.questionCounter++;
          this.timer1=10.0;
          this.questionTimer=setInterval(this.myTimer1, 100);
        }
        else{
          clearInterval(this.nextQuestionTimer);
          $('.modal').modal('toggle');
          $(".modal").on("hide.bs.modal", function () {
           window.location.reload();
          });
        }
    },
    myStopFunction1() {
        if(this.questionCounter<9){
          clearInterval(this.questionTimer);
          $('button[value="'+this.pitanja[this.questionCounter].tacanOdgovor+'"]').css({"background-color":"green", "color":"#fff"});
          $(".btn-outline-secondary").prop("disabled",true);
          $('.nextQuestion').append("<h3 class='istekloVreme'>Vreme je isteklo.</h3>");
          this.nextQuestionTimeShow=true;
          this.endQuizShow=false;
          this.timer=3;
          this.nextQuestionTimer = setInterval(this.myTimer, 1000);
        }
        else {
         clearInterval(this.questionTimer); 
         $('button[value="'+this.pitanja[this.questionCounter].tacanOdgovor+'"]').css({"background-color":"green", "color":"#fff"});
         $('.modal').modal('toggle');
         $(".modal").on("hide.bs.modal", function () {
           window.location.reload();
          });
        }
    }
  },
  filters:{
    upper:function(value){
      return value.toUpperCase();
    },
    textReduce:function(value){
      return value.slice(0,140)+'...';
    }
  },
  computed:{
  },
  beforeUpdate:function(){
    
  }
});

if (!("ontouchstart" in document.documentElement)) {
      document.documentElement.className += " no-touch";
      }// this is for no hover on touch-screens

