const api = 'https://pokeapi.co/api/v2/generation';
const axios = require('axios')

const index = (req, res) => {
    axios
    .get(api)
    .then((response) => {
        // res.json({
        //     generations: response.data.results
        // });
        res.render('generations/index', {
            generations: response.data.results
        });
    })
    .catch( (err) => {
        console.log(err);
        res.json ({
            status: 500,
            message: 'Internal Server Error'
        });
    });
}

const show = async (req, res) => {
    const id = req.params.id;
    console.log(id, ' <-- req.params.id');

    try {
        const foundGeneration = await axios.get(`${api}/${id}`);
        console.log(foundGeneration.data.names[5], '<-- english information')
        res.json({
            type: foundGeneration.data,
            name: foundGeneration.data.main_region.name,
            url: foundGeneration.data.main_region.url
        });
    } catch (err) {
        console.log(err);
        res.json ({
            status: 500,
            message: 'Internal Server Error'
        });
    }
}

module.exports = {
    index,
    show
}