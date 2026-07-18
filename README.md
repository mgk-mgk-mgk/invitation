# 달항아리 — 모바일 청첩장

두 그릇을 빚어 잇대면 비로소 둥근 달이 차오르듯, 두 사람이 하나의 원을 이룬다는
**달항아리(Moon Jar)** 콘셉트의 셀프 호스팅 모바일 청첩장입니다.

- 정적 파일 구성 — 폰트·음악은 내장, 클로징 사진은 로컬 자산 사용 (지도만 외부 iframe)
- 라이트/다크 테마 자동 대응 (백자 낮 · 달밤)
- 히어로 달항아리 결합 애니메이션, 인주 도장 스크롤 연출, 달의 위상 타임라인
- 달력 + 실시간 카운트다운, 사계절 수묵 캔버스 갤러리(사진 교체 가능)
- 주소·계좌번호 복사, 지도 앱 연결, 청첩장 공유
- 로컬 오디오 파일을 사용한 BGM 재생·일시 정지

## 내용 바꾸기

`index.html`의 `<script>` 맨 위 **`CONFIG` 객체 하나만 수정**하면
이름·날짜·장소·교통·계좌·클로징 사진이 전부 갱신됩니다.
달력과 카운트다운은 `weddingISO` 값에서 자동 계산됩니다.

```js
const CONFIG = {
  groomName: '김민준',
  weddingISO: '2026-10-24T14:00:00+09:00',
  venueName: '한옥별서 고운재',
  // ...
};
```

### 사진 넣기

`CONFIG.gallery` 각 항목의 `src`에 이미지 경로를 넣으면 수묵 일러스트 대신
사진이 표시됩니다. (`images/01.jpg`처럼 상대 경로 권장)

```js
gallery: [
  { src: 'images/first-spring.jpg', season: 'spring', year: '2019', cap: '처음 만난 봄' },
],
```

마지막 클로징 배경은 `CONFIG.closingImage`에서 교체할 수 있습니다.

```js
closingImage: 'images/closing.jpg',
```

## 배포

정적 파일이므로 아무 정적 호스팅에나 올리면 됩니다. `index.html`과 `images` 폴더를 함께 배포하세요.

- **GitHub Pages**: 리포지토리에 푸시 → Settings → Pages
- **Vercel / Netlify**: 폴더를 드래그 앤 드롭
