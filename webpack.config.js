// Archivo de configuracion del proyecto webpack (PARA PRODUCCION).

const HtmlWebpack = require('html-webpack-plugin');
const path = require('path');

let otherHtmlPageNames = ['amigos']; // Añade tus templates aqui.
let multipleHtmlPlugins = otherHtmlPageNames.map(name => {
    return new HtmlWebpack({
        filename: `html/${name}.html`,
        template: `./src/html/${name}.html`,
        chunks: [`${name}`],
        scriptLoading: 'blocking',
    })
});


let entryJsPropertieFiles = otherHtmlPageNames.map(name => {
    return JSON.parse(`{ "${name}": "./src/index.js" }`);
});
let entries = {};
for (file of entryJsPropertieFiles) {
    Object.assign(entries, file); 
}


// Exportaciones raiz de los modulos (ENTRY POINT DE UN PROYECTO WEBPACK):
module.exports = {
    // <= Modo de construccion del proyecto al compilar: =>
    // Aca podemos configurar si el proyecto va a arrancar en modo desarrollo o en modo
    // de produccion. Basicamente la diferencia es que el codigo estara ofuscado en el modo
    // produccion y en el modo desarrollo no.
    mode: 'development',

    // <== MODULE ==>
    /*
       Sirve para poder configurar el comportamiento de los modulos el proyecto webpack.
    */
    entry: {
        index: './src/index.js',
        amigos: './src/index.js',
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        // Definamos reglas para el modulo
        rules: [
            {
                // Vamos a leer todos los archivos HTML para pasarlos al build de produccion o desarrollo.
                test: /\.html$/,
                // Cargamos el loader.
                loader: 'html-loader',
                // Definimos algunas opciones para la carga de los archivos HTML, vamos a pedir que por el momento
                // no carge ninguna fuente de informacion externa inyectada en el HTML, como imagenes, videos, etc.
                options: {
                    sources: false
                }
            }
        ]
    },

    // <== OPTIMIZATION ==>
    /*
       Sirve para optimizar el proeyecto webpack.
    */
    optimization: {},

    // <== PLUGINS ==>
    /*
       Sirven para poder personzalizar el proceso de creacion del paquete web, con el fin de 
       modificar el resultado al ejecutar un proyecto.
    */
    plugins: [
        new HtmlWebpack()
    ].concat(multipleHtmlPlugins),

};



// PENDIENTE DOCUMENTAR TODO ESTO