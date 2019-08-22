[![CircleCI](https://circleci.com/gh/ken0x0a/react-native-reanimated-indicators/tree/master.svg?style=svg)](https://circleci.com/gh/ken0x0a/react-native-reanimated-indicators/tree/master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Non JS thread blocking indicator components for React Native.

There is [the awesome indicators library (react-native-indicators)][react-native-indicators] from long time ago.
But, as `Animated` from `react-native` contact with JS thread when animation is finished, it makes `InteractionManager.runAfterInteraction` never run...

---

- [Usage](#usage)
- [Components](#components)
  - [1. `<BallIndicator />`](#1-ballindicator)
  - [2. `<DotIndicator />`](#2-dotindicator)
- [Status](#status)
- [Why I created this library](#why-i-created-this-library)

---

## Usage

```sh
yarn add react-native-reanimated-indicators
```


## Components

### 1. `<BallIndicator />`

Looks almost same with original.

```tsx
<BallIndicator color="orange" />
```

### 2. `<DotIndicator />`

Looks like the indicator at "Messages" at "mac os" or "iOS", but I couldn't create the same.

```tsx
<DotIndicator color="tomato" scaleEnabled={true} />
```

## Status

If anyone interested in adding new indicators, I appreciate the PR 🙌

## Why I created this library

I was using [the awesome library (react-native-indicators)][react-native-indicators], until use it with `InteractionManager.runAfterInteraction()`.

As `Animated` from `react-native` contact with JS thread when animation is finished, `InteractionManager.runAfterInteraction` never run...
I didn't understand for a while, and I switch to `ActivityIndicator` at that moment.

After that,
I got to know [Can it be done in React Native?](https://www.youtube.com/user/wcandill/videos) and I was start thinking "by using the library `react-native-reanimated`, CAN IT BE DONE?"





[react-native-indicators]: https://github.com/n4kz/react-native-indicators
