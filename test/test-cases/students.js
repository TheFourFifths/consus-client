import items from './items';
import models from './models';

export default [
    {
        id: 123456,
        name: 'John von Neumann',
        status: 'C - Current',
        email: 'neumannJ@msoe.edu',
        major: 'Software Engineering',
        items: [],
        models: []
    },
    {
        id: 111111,
        name: 'Boaty McBoatface',
        status: 'C - Current',
        email: 'mcboatfaceb@msoe.edu',
        major: 'Hyperdimensional Nautical Machines Engineering',
        items: [items[2]],
        models: []
    },
    {
        id: 999999,
        name: 'Testy McTesterson',
        status: 'C - Current',
        email: 'mctestersont@msoe.edu',
        major: 'Engineering Engineering',
        items: [],
        models: [models[2], models[2], models[2], models[2], models[2], models[3]]
    }
]
