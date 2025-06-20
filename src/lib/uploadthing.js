import { createUploadthing } from 'uploadthing/next';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const f = createUploadthing();

export const ourFileRouter = {
  audioUploader: f({ audio: { maxFileSize: '32MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Get user session
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      // If user is not authenticated, throw error
      if (!user || !user.id) throw new Error('Unauthorized');

      // Return user info to be passed to onUploadComplete
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);

      // Return data to be sent to client
      return { uploadedBy: metadata.userId, url: file.url };
    }),
};

export { createRouteHandler } from 'uploadthing/next'; 