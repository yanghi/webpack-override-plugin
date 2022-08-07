import {login as OriginLogin} from "shared/lib/api/user"

export const login: typeof OriginLogin = function(p){
    console.log('override login--',p)
}