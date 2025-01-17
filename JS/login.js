const loginForm = document.querySelector("#login-form");
const loginInput = loginForm.querySelector("input");
//태그가 몇 개 없는 간단한 ui라 별도로 id 부여 x
const div = document.querySelector("div");
const h1 = document.querySelector("h1");
const h2 = document.querySelector("h2");
const list = document.querySelector("#ovr");
const USERNAME_KEY = "username";


let getUserItem = () => {
    return localStorage.getItem(USERNAME_KEY) ?? loginInput.value;
}

class Character {
    constructor(name, hp, damage){
        this.name = name,
        this.hp = hp,
        this.damage = damage
    }

    // 아래서 올라온 attacked함수의 this는 몬스터.
    attacked(damage){
        this.hp -= damage;
        console.log(`${this.name}의 체력이 ${this.hp} 남았습니다.`);
        // this.attack(target);
        if(this.hp <= 0) {
            console.log(`${this.name}이 사망했습니다.`)
            this.finish()
        } // else if(target.hp <= 0) {
        //     console.log(`${target.name}이 사망하셨습니다. F5를 눌러 다시 시작하세요.`)
        // }
    }
//내가 적을 공격합니다. this 나 target 적
    attack(target){
        console.log(`${this.name}이 ${target.name}을 공격합니다.`)
        //Character를 상속받는 인스턴스인 attacked 함수의 파라미터에 this.damage할당.
        target.attacked(this.damage);
        if (target.hp <= 0) {
            console.log(`전투에 승리하셨습니다.`);
            this.finish()
        }
    }

    finish() {
        characterSetting();
    }

}

var user, wizard, warrior, archer, RandomMonster;
characterSetting();
const enemy = [wizard, warrior, archer];

function characterSetting() {
    user = new Character(getUserItem(), 90, 15);
    wizard = new Character("wizard", 70, 30);
    warrior = new Character("warrior", 120, 7);
    archer = new Character("archer", 100, 10);
}

//로컬스토리지에 키 값 없을 경우
function onsubmit(event){
    event.preventDefault();
    loginForm.classList.add("hidden");
    localStorage.setItem(USERNAME_KEY, loginInput.value);
    div.classList.remove("hidden");
    wellcome(loginInput.value);
}
//로컬스토리지에 키 값이 있거나 생성되었을 경우
function wellcome(){
    //기존 변수를 사용하면 null. Myname을 읽지 못하는 이유 질문할 것!
    let myname = getUserItem()
    div.classList.remove("hidden");
    alert(`환영합니다 ${myname}님. 화면의 버튼을 눌러 적을 생성하세요.`);
}

//호이스팅 마친 후 여기부터 읽기 시작.
if(!getUserItem()){
    loginForm.classList.remove("hidden");
    loginForm.addEventListener("submit", onsubmit);
} else {
    div.classList.remove("hidden");
    wellcome();
}
const att = document.querySelector("#attack");
const run = document.querySelector("#run");

let create = () => {
    RandomMonster = enemy[Math.floor(Math.random() * 3)];
    div.classList.add("hidden");
    h1.classList.remove("hidden");
    h2.classList.remove("hidden");

    alert(`전방에 ${RandomMonster.name} 출현!`);
    console.log(user);
    console.log(RandomMonster);

    localStorage.setItem("enemy", JSON.stringify(RandomMonster));


    list.classList.remove("hidden");
    list.innerText = `콘솔창을 열어 자세한 정보를 확인하세요.
    나의 정보 : ${JSON.stringify(user)}
    적의 정보 : ${JSON.stringify(RandomMonster)}`
    h1.innerText = "어떻게 하시겠습니까?"


    // 공격을 눌렀을 시 아래의 함수 실행
    att.addEventListener("click", startBattle);

}

let startBattle = () => {
    user.attack(RandomMonster);
    if(RandomMonster.hp > 0){
        RandomMonster.attack(user);
    }
}

//적 생성버튼을 누르면 발생하는 이벤트
div.addEventListener("click", create);

run.addEventListener("click", runner);

function runner(){
    // 여기도 마찬가지로 변수를 읽지 못함. <-- 왜?
    const getMyName = localStorage.getItem(USERNAME_KEY);
    alert(`${getMyName}님이 신속하게 몸을 숨겼습니다.`);
    list.classList.add("hidden");
    h1.classList.add("hidden");
    h2.classList.add("hidden");

    div.classList.remove("hidden");
    characterSetting();

    // 도망칠 때, 이벤트를 지워놓고 가야합니다
    // 만약 또 create에서 addEvent를 할 경우 2번의 이벤트가 발생하기 때문에
    // 이벤트는 꼭 지워야 해요
    att.removeEventListener("click", startBattle);
}

//----------------------------------------------------------------------------------------


// class Hero extends Character {
//     //오버라이딩(super.메소드) = 부모클래스(Character)의 메소드(attacked)를 사용 및 확장함.
//     attaked(){
//         super.attacked();
//             if(this.hp <= 0) {
//             console.log(`${this.name}이 사망하셨습니다. F5를 눌러 다시 시작하세요.`)
//             battle = false;
//             gameover = true;
//         }
//     }

//     attack(){
//         super.attack();
//         if (target.hp <= 0) {
//             console.log(`전투에 승리하셨습니다.`);
//           }
//     }
// }

//-----------------------------------실패한 코드들-------------------------------------------

// 반복문 돌리려 한 자동 전투 함수
// function fight(){
//     const MyHero = new Hero();
//     console.log(``)
//     // while (!gameover){
//     //     battle = true;
//     //         while(battle){
//     //           Hero.attack()
//     //         }
//     // }
// }


//빈 배열을 만들고 상대를 넣으니 상속을 받지 못해 실패.
// const ArrMons =[];
// function startBattle(){
//     const MyHero = new Character(Myname, 100, 10);
//     const Monster = localStorage.getItem("enemy");

//     if(Monster !== null){
//         const Mons = JSON.parse(Monster);
//         ArrMons.push(Mons);
//     }
//     console.log(MyHero);
//     console.log(ArrMons);
//     console.log(MyHero.attack(ArrMons[0]));
// }



//1. localStrage.getItem 에서 null
//2. 도망친 후 다시 몹 생성하면, 단순히 버튼만 none했다가 block한거라 기존 몹이 남아 있음. -> 재생성한 몹과 싸울 때 1:2함
//3. 몹이랑 싸우다가 죽거나 아슬아슬할 때 정신승리 나옴. (내가 죽어도 승리메시지 나옴.)
//4. import export로 스크립트 파일 간 모듈화 안되는 이유