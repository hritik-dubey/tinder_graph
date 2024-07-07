'use server'
import {driver} from "@/db";
import {NEO4JUSER} from "@/types";


export const getUserBYID = async (id: string) => {
    const result = await driver.executeQuery(`MATCH (u: User {applicationId: $applicationId}) RETURN u`,{
        applicationId:id
    })
    const user = result.records.map((record) => record.get('u').properties);
    if (!(user.length)) return null
    console.log("user:", JSON.stringify(user, null, 2));
    return user as NEO4JUSER;
}

export const createUser = async (user: NEO4JUSER) => {
    const {firstName, lastName, email, applicationId} = user
    let createduser = await driver.executeQuery(`CREATE (u:User {applicationId: $applicationId , email: $email ,firstName: $firstName, lastName: $lastName})`, {
        applicationId,
        firstName,
        lastName,
        email
    })
    console.log("createduser:", JSON.stringify(createduser, null, 2));
}