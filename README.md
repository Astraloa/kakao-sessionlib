# kakao-sessionlib
> Auto GET KakaoTalk Authorize Info
>
> Need : su, root device, and some friends
>
> `코드가 더러워서 부끄러워요 !`

# code
>
> ```js
> let sessionlib = require('kakao-sessionlib');
> let Authorize = new sessionlib('com.kakao.talk', '11.0.3');
> Authorize.getAuthorization();
>
> let accessToken = Authorize.accessToken;
> let deviceUUID = Authorize.deviceUUID;
> ```
