"use server"

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data) {
    const { userId, orgId} = auth();

    if (!userId || !orgId) {
        throw new Error("User not authenticated");
    }

    const {data: membership} = await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: orgId
    })

    const userMembership = membership.find(
        (member) => member.publicUserData.userId === userId
    )

    if (!userMembership || userMembership.role !== "org:admin") {
        throw new Error("Only organization admins can create projects");
    }

    try {
        const project = await db.project.create({
            data: {
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId
            }
        })

        return project;
    } catch (error) {
        throw new Error("Failed to create project: " + error.message);
    }
}

export async function getProjects(orgId) {
    const { userId } = auth();
  
    if (!userId) {
      throw new Error("Unauthorized");
    }
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    const projects = await db.project.findMany({
      where: { organizationId: orgId },
          orderBy: { createdAt: "desc" },
    });

    return projects;
  }

  export async function deleteProject (projectId) {
    const { userId, orgId, orgRole } = auth();

    if (!userId || !orgId) {
        throw new Error("User not authenticated");
    }

    if (orgRole !== "org:admin") {
        throw new Error("Only organization admins can delete projects");
    }

    const project = await db.project.findUnique({
        where: {
            id: projectId
        }
    })

    if (!project || project.organizationId !== orgId) {
        throw new Error("Project not found");
    }

    await db.project.delete({
        where: {
            id: projectId
        }
    })

    return {success: true}
  }