export const isEdited = ({
  created_at,
  updated_at,
}: {
  created_at: Date;
  updated_at: Date;
}) => {
  const createdAtDate = new Date(created_at).getTime();
  const updatedAtDate = new Date(updated_at).getTime();

  if (createdAtDate !== updatedAtDate) {
    return true;
  }

  return false;
};
