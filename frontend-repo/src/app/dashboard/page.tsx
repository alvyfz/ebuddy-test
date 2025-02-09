"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
} from "@mui/material";
import UserBodyTable from "@/components/Table/UserList";
import Layout from "@/components/Layout/layoutPage";
import useHelperApiClient from "@/hooks/useHelperApiClient";
import useSWR from "swr";
import { requestAPI } from "@/api/api";
import { PATH_API } from "@/api/uri";
import { signOut } from "@/api/auth";
import { useCookies } from "next-client-cookies";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { set: setCookies } = useCookies();
  const { baseUrl } = useHelperApiClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const router = useRouter();

  const { data, isLoading, mutate } = useSWR(
    `${PATH_API.GET_ALL_USERS}?page=${page + 1}&size=${rowsPerPage}`,
    (url) => requestAPI.get(url),
    {
      revalidateIfStale: true,
    }
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleLogout = async () => {
    try {
      await signOut(setCookies);
      router.replace("/login");
    } catch (error) {
      toast.error("Error signing out, Please try again later.");
    }
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard User List
          </Typography>
          <Button onClick={handleLogout} color="error">
            Logout
          </Button>
        </Box>

        <Paper
          sx={{
            width: "100%",
            overflowX: "auto",
            marginTop: 10,
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Total Average Weight Ratings</TableCell>
                  <TableCell>Number Of Rents</TableCell>
                  <TableCell>Recently Active</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              {!isLoading && data?.payload?.data?.length && (
                <>
                  <TableBody>
                    <UserBodyTable data={data?.payload?.data} refreshData={mutate} />
                  </TableBody>
                </>
              )}
              {isLoading && (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography component="h6" sx={{ textAlign: "center" }}>
                        Loading...
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
              {!isLoading && !data?.payload?.data?.length && (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography component="h6" sx={{ textAlign: "center" }}>
                        Loading...
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.payload?.count || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Layout>
  );
}
