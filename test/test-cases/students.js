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
        models: [
            {
                address: models[2].address,
                name: models[2].name,
                quantity: 5,
                timestamp: Math.floor(Date.now() / 1000),
                status: 'CHECKED_OUT'
            },
            {
                address: models[3].address,
                name: models[3].name,
                quantity: 1,
                timestamp: Math.floor(Date.now() / 1000),
                status: 'CHECKED_OUT'
            }
        ]
    }
]
