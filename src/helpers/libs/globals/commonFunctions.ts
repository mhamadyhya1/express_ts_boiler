import { unSearchedValues } from "./globalVariables";
import ErrorHandling from "@libs/globals/errorHandling";

const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

class CommonFunctions {

    public getToken(event) {
        console.log('eventt iss ',event)
        let token = event.headers['Authorization'].split('Bearer')[1];
        console.log('tokentokentoken ', token);
        return token.trim();
    }

    public getTokenFromAuthorizer(event) {
        // console.log('eventt iss ',event)
        let token = event.authorizationToken.split('Bearer')[1];
        // console.log('tokentokentoken ', token);
        return token.trim();
    }

    public escapeStringRegexp(str: string) {
        if (typeof str !== 'string') {
            throw new TypeError('Expected a string');
        }

        return str.replace(matchOperatorsRe, '\\$&');
    }

    public getSearchedList(
        searchedValue: string, 
        fieldsListToSearchIn: Array<string>) {
        try {
            const keyword = searchedValue.trim();
            /// split the searched value
            let splitText = keyword.split(" ");
            let arr = [];
    
            //todo: should get language from user profile
            let list = this.noNeedTSearchWith('en');
    
            /// add in an array the keywords in the searched values without adding the unneeded keys
            for (let i = 0; i < splitText.length; i++) {
                let value = splitText[i];
                if(!list.includes(value)){
                    arr.push(value)
                }
            }
    
            /// assign regex to the array having all the values to search on
            let regex = arr.join("|");
    
            /// 1st way: make one search and get all data
            // go and search the projects that have the matching keys in any of the matched fields of the array
            let searchedList = [];
            for (let i = 0; i < fieldsListToSearchIn.length; i++) {
                let searchedMap = new Map();
                let key = fieldsListToSearchIn[i];
                searchedMap.set(key, {
                    "$regex": regex,
                    "$options": "i"
                });
                searchedList.push(searchedMap);
            }
            return searchedList
        } catch(e) {
            throw new ErrorHandling().getErrorMessage(e);
        }
    }

    public noNeedTSearchWith (lang: string) {
        console.log('unSearchedValues[lang]  ',unSearchedValues[lang])
        let arr = [];
        arr = unSearchedValues[lang];
        return arr;
    }
}

export default CommonFunctions;