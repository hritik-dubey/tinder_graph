'use client'
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import * as react from 'react';
import {NEO4JUSER} from "@/types";
import TinderCard from "react-tinder-card";
import {swipeuser} from "@/app/neo4j.action";

interface IHomePageComponent {
    currentUser: NEO4JUSER
    users: NEO4JUSER[]
}


export const HomePageClient: react.FC<IHomePageComponent> = ({currentUser, users}) => {
    const handelSwipe =async (direction,userId,)=>{
        const isMatch  =  await swipeuser(currentUser.applicationId,direction,userId)
        if(isMatch){
            alert("congrats !! Its a match")
        }
    }
    console.log({username:currentUser.firstName})
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div>
                <div>
                    <h1 className='text-4xl'> Hello {currentUser.firstName}</h1>
                </div>
                <div className='mt-4 relative'>
                    {users.map(user => <TinderCard key={user.applicationId} className='absolute' onSwipe={(direction)=>handelSwipe(direction,user.applicationId)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                            {/*<CardContent>*/}
                            {/*    <p>Card Content</p>*/}
                            {/*</CardContent>*/}
                            {/*<CardFooter>*/}
                            {/*    <p>Card Footer</p>*/}
                            {/*</CardFooter>*/}
                        </Card>
                    </TinderCard>)}
                </div>
            </div>
        </div>
    )
}