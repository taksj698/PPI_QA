import { Typography } from "@mui/material";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  // return (
  //   <Typography>Test</Typography>
  // );
    redirect('/login')
}
