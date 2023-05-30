export const generarHtml = (nombre) => {
    const obj = (document.createElement('h1'));
    obj.appendChild(document.createTextNode(saludar(nombre)));
    document.body.appendChild(obj);
    console.log('first')
}

const saludar = nombre => `Hola, ${nombre}.`;

