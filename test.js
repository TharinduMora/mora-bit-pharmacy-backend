
function aaa1(){
    console.log("Started");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // resolve(true);
            reject("kela");
        }, 2000);
    });
};

async function asd() {
    const aaa = await aaa1().catch(()=>{});
    console.log(aaa);
}

function asd2(){
    console.log("func 2");
}

asd().then();
asd2();