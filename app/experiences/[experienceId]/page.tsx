import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";

export default async function ExperiencePage({
    params,
}: {
    params: { experienceId: string };
}) {
	// The headers contains the user token
	const headersList = await headers();

    // The experienceId is a path param
    const { experienceId } = params;

	// The user token is in the headers
    const { userId } = await whopSdk.verifyUserToken(headersList);

    let result: { hasAccess: boolean; accessLevel: 'admin' | 'customer' | 'no_access' } = {
        hasAccess: true,
        accessLevel: 'customer',
    } as any;
    try {
        result = await whopSdk.access.checkIfUserHasAccessToExperience({
            userId,
            experienceId,
        }) as any;
    } catch (_) {
        // In local/dev without a valid API key, allow access to continue
    }

    let user: any = { name: 'Creator', username: 'creator' };
    let experience: any = { name: experienceId };
    try {
        user = await whopSdk.users.getUser({ userId });
        experience = await whopSdk.experiences.getExperience({ experienceId });
    } catch (_) {
        // Skip if API key not present in dev
    }

	// Either: 'admin' | 'customer' | 'no_access';
	// 'admin' means the user is an admin of the whop, such as an owner or moderator
	// 'customer' means the user is a common member in this whop
	// 'no_access' means the user does not have access to the whop
	const { accessLevel } = result;

	return (
		<div className="flex justify-center items-center h-screen px-8">
			<h1 className="text-xl">
				Hi <strong>{user.name}</strong>, you{" "}
				<strong>{result.hasAccess ? "have" : "do not have"} access</strong> to
				this experience. Your access level to this whop is:{" "}
				<strong>{accessLevel}</strong>. <br />
				<br />
				Your user ID is <strong>{userId}</strong> and your username is{" "}
				<strong>@{user.username}</strong>.<br />
				<br />
				You are viewing the experience: <strong>{experience.name}</strong>
			</h1>
		</div>
	);
}
