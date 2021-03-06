const api = 'https://pokeapi.co/api/v2/pokemon';
const axios = require('axios');
const { response } = require('express');
const firebase = require('../config/firebase');
const evolutions = require('./evolutions');

// const config = {
//   method: 'get',
//   url: 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0',
//   headers: { 
//     'Cookie': '__cfduid=d20fc2ccf46f4d34c36ab082f14e3ad5a1596664571'
//   }
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });




const index = (req, res) => {
    axios
    .get(api + '?limit=151&offset=0')
    .then( (response) => {
        res.render('pokemons/index',{names: response.data.results })
        // res.json({
        //     pokemon: response.data.results
        // });
    })
    .catch( (err) => {
        console.log(err);
        res.render('error', {err});
        // res.json ({
        //     status: 500,
        //     message: 'Internal Server Error'
        // });
    });
};

const post = (req, res) => {
    axios
    .get(api + '?limit=151&offset=0')
    .then( (response) => {
        // res.json({
        //     pokemon: response.data.results
        // });

        //render the ejs file
        const input = req.body.searchInput;
        console.log(input);
        res.render('pokemons/redirect', {url: input});

    })
    .catch( (err) => {
        console.log(err);
        res.render('error',{err});
        // res.json ({
        //     status: 500,
        //     message: 'Internal Server Error'
        // });
    });

};

const show = async (req, res) => {
    const id = req.params.id
    console.log(id)

    try { 
        //pokemon
        const foundPokemon = await axios.get(`${api}/${id}`);
        const userPokemon = await firebase.doGetPokemon(id);
        // res.json({
        //     pokemon: foundPokemon.data,
        //     name: foundPokemon.data.forms[0].name,
        //     type: foundPokemon.data.types,
        //     species: foundPokemon.data.species
        // });
        const pokemonData = foundPokemon.data;
        const pokemonId = foundPokemon.data.id
        const name = foundPokemon.data.forms[0].name;
        const type = foundPokemon.data.types;
        const species = foundPokemon.data.species;
        const speciesURL = foundPokemon.data.species.url;
        const pokemonPic = foundPokemon.data.sprites.front_default;

        //pokemon-species
        const foundSpecies = await axios.get(speciesURL);
        // res.json({
        //         data: foundSpecies.data,
        //         evolutionURL: foundSpecies.data.evolution_chain.url,
        //         generation: foundSpecies.data.generation.name,
        //         generationURL: foundSpecies.data.generation.url
        //      });
       
        const speciesData = foundSpecies.data;
        const evolutionURL = foundSpecies.data.evolution_chain.url;
        const generationName = foundSpecies.data.generation.name;
        const generationURL = foundSpecies.data.generation.url;

        //evolution-chain
        const foundEvolution = await axios.get(evolutionURL);
        // res.json({
        //         data: foundEvolution.data,
        //         chain: foundEvolution.data.chain // data is in nested 'evolves_to' groups 
        //      });
        const evolutionData = foundEvolution.data;
        const chain = foundEvolution.data.chain; // data is in nested 'evolves_to' groups 
        const baseEvolution = chain;
        // const secondEvolution = chain?.evolves_to;
        //const evolves_to3 = chain.evolves_to[0]?.evolves_to;
        console.log('Base: ', baseEvolution.species.name);

        // let firstEvo =[];
        // if(secondEvolution){
        //     firstEvo = secondEvolution.map(evolution => {
        //         console.log('Second: ', evolution.species.name);
        //         if(evolution.evolves_to){
        //             evolution.evolves_to.map(eve =>{
        //                 console.log('3rd: ', eve.species.name);
        //             });
        //         }
        //         //return evolution.species.name;
        //     });
            // if (evolves_to3){
            //     evlove3 = evolves_to3.map(evolution => {
            //         console.log(evolution.species.name);
            //         //return evolution.species.name;
            //     });
            // };
        // }




        //Generation
        const foundGeneration = await axios.get(generationURL);
        // res.json({
        //         data: foundGeneration.data,
        //         region: foundGeneration.data.main_region,
        //         generation: foundGeneration.data.name
        //     });
        const generationData = foundGeneration.data;
        const region = foundGeneration.data.main_region;
        
//{“linktojson”: “filelink.json”}

        res.render('pokemons/pokemon_index.ejs', {
            name,
            id: pokemonId,
            type,
            generationName,
            region,
            chain,
            pokemonPic,
            userPokemon: userPokemon.data() || []
        });
        
    } catch (err) {
        res.render('error', {err});
        // res.json({
        //     status: 500,
        //     message: 'Internal Server Error'
        // });
    }
};

const likePokemon = (req, res) => {
    console.log(req.session);
    firebase
        .doLikePokemon(req.params.id, req.session.user.uid)
        .then((snapShot) => {
            res.redirect(`/pokemon/${req.params.id}`)
        });
}

const unlikePokemon = (req, res) => {
    console.log(req.session);
    firebase
        .doUnlikePokemon(req.params.id, req.session.user.id)
        .then((snapShot) => {
            console.log(snapShot);
        });
}


module.exports = {
    index,
    post,
    show,
    likePokemon,
    unlikePokemon
}