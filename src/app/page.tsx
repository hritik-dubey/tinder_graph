import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import {redirect} from "next/navigation";
import {getUserBYID, getuserWithNoConnection} from "@/app/neo4j.action";
import {HomePageClient} from "@/components/Home";
import {NEO4JUSER} from "@/types";

export default async function Home() {
    const {isAuthenticated, getUser} = getKindeServerSession()
    if (!(await isAuthenticated())) {
        return redirect(`/api/auth/login?post_login_redirect_url=http://localhost:3000/callback`);
    }
    const user = await getUser();
    if (!user) {
        return redirect(`/api/auth/login?post_login_redirect_url=http://localhost:3000/callback`);
    }
    const userWithNoConnection: NEO4JUSER[] | any = await getuserWithNoConnection(user.id);
    const currentUser: NEO4JUSER | any = await getUserBYID(user.id);
    return (<main>
        {currentUser &&
            (<HomePageClient
                currentUser={currentUser}
                users={userWithNoConnection}>
            </HomePageClient>)
        }
    </main>)
}
