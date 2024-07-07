import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";
import {createUser, getUserBYID} from "@/app/neo4j.action";

export default async function callbackPage() {
    const {isAuthenticated, getUser} = getKindeServerSession()
    console.log("Authenticated")
    if (!(await isAuthenticated())) {
        return redirect(`/api/auth/login?post_login_redirect_url=http://localhost:3000`);
    }
    const user = await getUser();
    if (!user) {
        return redirect(`/api/auth/login?post_login_redirect_url=http://localhost:3000`);
    }
    console.log("User:", JSON.stringify(user,null, 2));
    const dbUser = await getUserBYID(user.id);
    if (!dbUser) {
        await createUser({
            applicationId: user.id,
            email: user.email!,
            firstName: user.given_name!,
            lastName: user.family_name ?? ""
        })
        console.log("Created new user in Neo4j")
    }
    return redirect(`/`)
}