import { Api, Util, Button } from 'shared'

function start(){
    Api.login({})
    Api.message()
    Util.add(1,2)
    console.log('Button', Button)
}

start()