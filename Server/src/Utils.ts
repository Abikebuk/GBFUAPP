import config from "../config.json";

function tagToLanguage(tag: string): string {
  switch (tag) {
    case "raid (en)":
      return "en";
    case "raid (jp)":
      return "jp";
    default:
      return "unknown";
  }
}

function setGenericHeaders(res: any): void {
  res.header("Access-Control-Allow-Origin", config.front_hostname);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
}

function printBanner(): void {
  console.log(
    "\n" +
      " ..|'''.|                           '||      '||                            \n" +
      ".|'     '  ... ..   ....   .. ...    || ...   ||  ... ...    ....         \n" +
      "||    ....  ||' '' '' .||   ||  ||   ||'  ||  ||   ||  ||  .|...||        \n" +
      "'|.    ||   ||     .|' ||   ||  ||   ||    |  ||   ||  ||  ||             \n" +
      " ''|...'|  .||.    '|..'|' .||. ||.  '|...'  .||.  '|..'|.  '|...'        \n" +
      "'||''''|                    .                                             \n" +
      " ||  .    ....   .. ...   .||.   ....    ....  .... ...                   \n" +
      " ||''|   '' .||   ||  ||   ||   '' .||  ||. '   '|.  |                    \n" +
      " ||      .|' ||   ||  ||   ||   .|' ||  . '|..   '|.|                     \n" +
      ".||.     '|..'|' .||. ||.  '|.' '|..'|' |'..|'    '|                      \n" +
      "                                               .. |                       \n" +
      "           .    ||  '||   ||    .               ''                        \n" +
      "... ...  .||.  ...   ||  ...  .||.  .... ...     ....   ... ...  ... ...  \n" +
      " ||  ||   ||    ||   ||   ||   ||    '|.  |     '' .||   ||'  ||  ||'  || \n" +
      " ||  ||   ||    ||   ||   ||   ||     '|.|      .|' ||   ||    |  ||    | \n" +
      " '|..'|.  '|.' .||. .||. .||.  '|.'    '|       '|..'|'  ||...'   ||...'  \n" +
      "                                    .. |                 ||       ||      \n" +
      "                                     ''                 ''''     ''''     \n" +
      "                         ,-,---.           ,.   .             .           \n" +
      "                          '|___/ . .      / |   |-. . . , ,-. |-. . . . , \n" +
      "                          ,|   \\ | |     /~~|-. | | | |/  |-' | | | | |/ \n" +
      "                         `-^---' `-|   ,'   `-' `-' ' |\\  `-' `-' `-' |\\\n" +
      "                                  /|                  ' `             ' ` \n" +
      "                                 `-'                                        " +
      "\n"
  );
}
export { printBanner, tagToLanguage, setGenericHeaders };
