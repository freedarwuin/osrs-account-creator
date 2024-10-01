import Scrappey from "scrappey-wrapper";
import qs from "qs";

/**
 * Obtenga su clave API en Scrappey.com
 */
const scrappey = new Scrappey("3THbzdehiocpNSZiLJOvEAO9aDTXIT7hA7CMgAC2YuIVB4ZaanzzWUgRpqgw");

/**
 * Complete los datos para registrarse en OSRS
 */
const EMAIL = '@gmail.com'
const PASSWORD = 'p0o9i8u7'
const DAY = '22'
const MONTH = '01'
const YEAR = '1988'

/**
* Esto solo enviará la solicitud GET, obtendrá el CSRF y luego enviará la solicitud POST
* Todos los captchas se resuelven automáticamente, incluido Incapsula anti-bot y torniquete usando Scrappy.
 */
async function run() {

    const createSession = await scrappey.createSession({
        // "proxy": "http://username:password@ip:port"
    })

    const session = createSession.session

    console.log(`Found session ${session}`)

    const get = await scrappey.get({
        session: session,
        url: 'https://secure.runescape.com/m=account-creation/create_account?theme=oldschool'
    })

    const csrf = get.solution.response.match(new RegExp(`<input type="hidden" name="csrf_token" value="(.*)" data-test="csrf-token">`))[1]

    const postData = {
        theme: "oldschool",
        flow: "web",
        email1: EMAIL,
        onlyOneEmail: 1,
        password1: PASSWORD,
        onlyOnePassword: 1,
        day: DAY,
        month: MONTH,
        year: YEAR,
        agree_terms: 1,
        "create-submit": "create",
        csrf_token: csrf
    };

    const post = await scrappey.post({
        session: session,
        url: 'https://secure.runescape.com/m=account-creation/create_account',
        postData: qs.stringify(postData),
    })

    console.log(post.solution.innerText)
    console.log(post.solution.title)

    await scrappey.destroySession(session)
}

run().then(() => {})