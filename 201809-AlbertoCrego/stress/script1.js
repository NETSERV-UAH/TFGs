import http from "k6/http";
import { sleep } from "k6";

export default function() {
  http.get("http://159.122.175.146:31481/get-ip");
  sleep(1);
};
