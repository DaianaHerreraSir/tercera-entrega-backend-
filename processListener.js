console.log("iniciando");

process.on("exit", code =>{
    console.log("antes de terminar el proceso", code);
})

process.on("uncaughtException ", exception =>{
    console.log("Atrapa un error no controlado", exception);
})



console.log("terminando");
