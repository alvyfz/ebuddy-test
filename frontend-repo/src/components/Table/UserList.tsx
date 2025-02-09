import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormInputText } from "../Form/FormInputText";
import { Button, TableCell, TableRow } from "@mui/material";
import { FormInputDate } from "../Form/FormInputDate";
import toast from "react-hot-toast";
import { PATH_API } from "@/api/uri";
import { requestAPI } from "@/api/api";

interface IFormUser {
  name: string;
  totalAverageWeightRatings: number | string;
  numberOfRents: number | string;
  recentlyActive: any;
}

export default function UserBodyTable({
  data,
  refreshData,
}: {
  data: any[];
  refreshData: () => void;
}) {
  return data?.map((user: any) => <Body key={user.id} data={user} refreshData={refreshData} />);
}

const Body = memo(({ data, refreshData }: { data: any; refreshData: () => void }) => {
  const [isEdit, setIsEdit] = useState(false);
  const defaultValues: IFormUser = {
    name: data?.name,
    totalAverageWeightRatings: data?.totalAverageWeightRatings || 0,
    numberOfRents: data?.numberOfRents || 0,
    recentlyActive: new Date(data?.recentlyActive?._seconds * 1000),
  };

  const { handleSubmit, reset, control, setValue, formState, trigger } = useForm<IFormUser>({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: IFormUser) => {
    try {
      const updateData = await requestAPI.put(`${PATH_API.UPDATE_USER}/${data.id}`, {
        params: {
          name: values.name,
          totalAverageWeightRatings: Number(values.totalAverageWeightRatings),
          numberOfRents: Number(values.numberOfRents),
          recentlyActive: values.recentlyActive,
        },
      });

      if (updateData.isSuccess) {
        toast.success("User updated successfully.");
        refreshData();
      } else {
        toast.error("Error updating user, Please try again later.");
      }
    } catch (error) {
      toast.error("Error updating user, Please try again later.");
    }
    setIsEdit(false);
  };

  useEffect(() => {
    trigger();
  }, []);

  return (
    <TableRow key={data.id}>
      {!isEdit ? (
        <>
          <TableCell>{data.name}</TableCell>
          <TableCell>{data.totalAverageWeightRatings}</TableCell>
          <TableCell>{data.numberOfRents}</TableCell>
          <TableCell>
            {moment(data?.recentlyActive?._seconds * 1000).format("YYYY-MM-DD")}
          </TableCell>
        </>
      ) : (
        <>
          <TableCell>
            <FormInputText name="name" control={control} label={""} />
          </TableCell>
          <TableCell>
            <FormInputText
              name="totalAverageWeightRatings"
              control={control}
              label={""}
              type="number"
            />
          </TableCell>
          <TableCell>
            <FormInputText name="numberOfRents" control={control} label={""} type="number" />
          </TableCell>
          <TableCell>
            <FormInputDate name="recentlyActive" control={control} label={""} />
          </TableCell>
        </>
      )}
      <TableCell>
        {!isEdit ? (
          <Button onClick={() => setIsEdit(true)}>Edit</Button>
        ) : (
          <div className="flex flex-row gap-1">
            <Button onClick={handleSubmit(onSubmit)}>Save</Button>
            <Button color="warning" onClick={() => setIsEdit(false)}>
              Cancel
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
});
