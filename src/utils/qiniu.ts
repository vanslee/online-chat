import * as qiniu from "qiniu-js";
import CryptoJS from "crypto-js";
import { utf16to8, base64Encode } from "@/utils/commons";
import { Config, Extra, UploadProgress } from "qiniu-js/esm/upload/base";
import { Observable } from "qiniu-js/esm/utils";
import { UploadCompleteData } from "qiniu-js/esm/api";
import { QiniuError, QiniuNetworkError, QiniuRequestError } from "qiniu-js";
const ACCESS_KEY = "FRMyr6yfm88JgtXwjILNam_uomMzbWOk7WrDWzjh";
const SECRET_KEY = "P8rPFTvtJ-RJrQDD5ORMLFdO0j9xw7gOGpeo4dib";
export const DOMAIN = "https://litubao.xyz/";
const BUCKET = "lidengxiang";
const DIRECTION = "Chat/";
const config: Config = {
  useCdnDomain: true,
  region: qiniu.region.cnEast2,
  forceDirect: true, // 是否上传全部采用直传方式
};

const putExtra: Partial<Extra> = {
  fname: "", //文件原文件名
};
export const uploadFile = (
  file: File
): Observable<
  UploadProgress,
  QiniuError | QiniuRequestError | QiniuNetworkError,
  UploadCompleteData
> => {
  const uptoken = getToken(ACCESS_KEY, SECRET_KEY, BUCKET);
  const key = `${DIRECTION}${file.name}`;
  putExtra.fname = file.name;
  return qiniu.upload(file, key, uptoken, putExtra, config);
};
const getToken = (
  access_key: string,
  secret_key: string,
  bucketname: string
) => {
  // 构造策略
  const putPolicy = {
    scope: bucketname,
    deadline: 3600 + Math.floor(Date.now() / 1000),
  };
  const encoded = base64Encode(utf16to8(JSON.stringify(putPolicy)));
  const hash = CryptoJS.HmacSHA1(encoded, secret_key);
  // 构造凭证
  const encodedSign = hash
    .toString(CryptoJS.enc.Base64)
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
  const uploadToken = access_key + ":" + encodedSign + ":" + encoded;
  return uploadToken;
};
