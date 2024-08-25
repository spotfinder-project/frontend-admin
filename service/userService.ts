type UserSlugProps = {
  slug: string;
};

export async function getUserBySlug({ slug }: UserSlugProps) {
  console.log(slug);
}
