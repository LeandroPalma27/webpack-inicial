// <====== Archivo de configuracion del proyecto webpack (PARA PRODUCCION). =======>
/**/

// Importacion de plugin para evaluar un archivo global CSS para transpasarlo al build de produccion (IMPORTADO EN EL HTML).
const MiniCssExtract = require("mini-css-extract-plugin");

// Importacion del plugin para el transpaso de archivos HTML 
const HtmlWebpack = require('html-webpack-plugin');
// Importacion del plugin para el manejo del directorio de salida.
const path = require('path');

// Templates que no necesiten ser relacionados con el entry JS global del proyecto:
let otherHtmlPageNamesWithoutEntryJS = ['ejemplo2-sinEntry'];
let multipleHtmlPluginsWithoutEntry = ((!otherHtmlPageNamesWithoutEntryJS.length ==  true ? [] : otherHtmlPageNamesWithoutEntryJS.map(name => {
    return new HtmlWebpack({
        // Ruta donde sera transpasado el archivo HTML en el dist:
        filename: `${name}.html`,
        // Ruta donde esta el archivo en el src para poder ser leido y transpasado:
        template: `./src/html/${name}.html`,
        // ENTRY JS privado que este template transpasado tendra inyectado en su codigo HTML a traves de una etiqueta script:
        chunks: [`${name}`],
        scriptLoading: 'blocking',
    })
})));


// SOLO PARA TEMPLATES QUE NECESITEN RELACION CON EL ENTRY JS GLOBAL DEL PROYECTO:
let otherHtmlPageNames = ['ejemplo1']; // Añade tus templates aqui para poder generar sus traspasos al build de produccion, asi como la relacion con el "index.js".

// Metodo para generar instancias de "HtmlWebpack" que contengan la informacion de todos los demas templates del proyecto en la ruta "html/", todo esto con el fin de hacer el transpaso.
// Estos son los que si necesitan el entry global.<
let multipleHtmlPlugins = ((!otherHtmlPageNames.length == true ? [] : otherHtmlPageNames.map(name => {
    return new HtmlWebpack({
        // Ruta donde sera transpasado el archivo HTML en el dist:
        filename: `${name}.html`,
        // Ruta donde esta el archivo en el src para poder ser leido y transpasado:
        template: `./src/html/${name}.html`,
        // Entries JS que este template transpasado tendra inyectados en su codigo HTML a traves de una etiqueta script (PRIVADO Y GLOBAL):
        chunks: ['main', `${name}`],
        scriptLoading: 'blocking',
    })
})));


// Metodo para generar un OBJETO de JsonString y almacenarlos en un array para posteriormente unirlos a un objeto "entries".
// Todo con el fin de poder obtener la relacion de los entries respectivos con cada uno de los templates.
// Recordar que en el entry estara toda la logica de nuestro proyecto WEBPACK HTML-CSS-JS (tendra toda la informacion de los modulos).
let totalTemplates = otherHtmlPageNames.concat(otherHtmlPageNamesWithoutEntryJS);
let entryJsPropertieFiles = ((!totalTemplates.length == true ? [] : totalTemplates.map(name => {
    return JSON.parse(`{ "${name}": "./src/js/${name}.js" }`);
})));
// Objeto JS con el nombre del template como atributo y la ruta del entry como valor del atributo:
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
    // Definimos cuales seran los entries de la aplicacion (los archivos JS principales de los templates o del proyecto en general).
   // En otras palabras, los entries que se van a pasar al build final.
    entry: {
        main: './src/main.js',
        ...entries,
        
    },
    // Salida de los archivos JS (cargan el nombre del template + ".js"):
    output: {
        filename: "js/[name][hash].js",
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        // Definamos reglas para el modulo
        rules: [
            {
                // Vamos a leer todos los archivos HTML para pasarlos al build de produccion o desarrollo.
                test: /\.html$/i,
                // Cargamos el loader.
                loader: 'html-loader',
                // Definimos algunas opciones para la carga de los archivos HTML, vamos a pedir que por el momento
                // no carge ninguna fuente de informacion externa inyectada en el HTML, como imagenes, videos, etc.
                options: {
                    sources: false
                }
            },
            // Regla para poder importar los archivos CSS desde JS (requieren instalacion de 2 plugins, 'style-loader' y 'css-loader')
            {
                test: /\.css$/,
                exclude: /styles.css$/,
                use: ['style-loader', 'css-loader'], 
            },
            {
                // Para añadir mas archivos, colocamos la expresion regular con el nombre del archivo (TAMBIEN SU EXCLUSION EN EL STYLE LOADER)
                test: [/styles.css$/],
                use: [MiniCssExtract.loader, 'css-loader'],
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
        new HtmlWebpack({
            filename: 'index.html',
            template: './src/index.html',
            excludeChunks: [...otherHtmlPageNames, ...otherHtmlPageNamesWithoutEntryJS],
            scriptLoading: 'blocking',
        }),
        // Colocar cada instancia del plugin para cada archivo CSS transpasado al build de produccion.
        new MiniCssExtract({
            filename: '[name][hash].css',
        })
    ].concat(multipleHtmlPlugins, multipleHtmlPluginsWithoutEntry),

};



//  - terminado mi king (DOCUMENTACION COMPLETA Y LOGICA TERMINADA).