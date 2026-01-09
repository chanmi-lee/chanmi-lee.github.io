---
layout: post
title: "Renovate로 패키지 버전 관리 자동화하기"
date: 2023-07-11
categories: [Renovate, Automation, GitHub, DevOps]
disqus_comments: true
pretty_table: true
typograms: true
toc:
  sidebar: left
---

프로젝트를 관리하다 보면 `npm outdated` 명령어를 통해 설치된 모듈들의 최신 버전을 확인하고 업데이트하는 과정이 꽤 번거로울 때가 있습니다. 특히 여러 프로젝트를 관리하거나 팀 단위로 작업할 때는 의존성 관리가 소홀해지기 쉽습니다. 이런 상황에서 **Renovate**를 사용하면 의존성 업데이트 과정을 자동화하여 개발 생산성을 높일 수 있습니다.

이번 포스팅에서는 Renovate GitHub App을 설치하고 설정하여 패키지 버전을 자동으로 관리하는 방법을 알아보겠습니다.

## Renovate란?

Renovate는 소프트웨어 프로젝트의 의존성 업데이트를 자동화해주는 도구입니다. 정기적으로 저장소를 스캔하여 구버전 의존성을 찾아내고, 자동으로 Pull Request(PR)를 생성해 줍니다.

## 설정 과정

### 1. Renovate GitHub App 설치

가장 먼저 해야 할 일은 GitHub 저장소에 Renovate GitHub App을 설치하는 것입니다.

1. [Renovate GitHub App](https://github.com/apps/renovate) 페이지로 이동합니다.
2. **Install** 버튼을 클릭합니다.
3. Renovate를 적용할 계정이나 조직(Organization)을 선택합니다.
4. **All repositories**를 선택하거나 **Only select repositories**를 선택하여 Renovate가 작동하길 원하는 리포지토리에 권한을 부여합니다.

### 2. renovate.json 설정 추가

GitHub App 설치 후, Renovate 봇이 작동하기 원하는 리포지토리의 루트 디렉토리에 설정 파일을 추가해야 합니다.

프로젝트 루트에 `renovate.json` 파일을 생성하고 설정을 추가합니다. 단순히 기본 설정(`config:base`)만 사용할 수도 있지만, 업무 흐름에 방해가 되지 않도록 **매주 월요일 오전 9시에 Minor와 Patch 업데이트를 모아서** PR을 생성하도록 설정해보겠습니다.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  "timezone": "Asia/Seoul",
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "groupName": "all non-major dependencies",
      "schedule": ["before 9am on Monday"]
    }
  ]
}
```

- `$schema`: 설정 파일의 유효성을 검사하고 자동 완성을 도와줍니다.
- `extends`: Renovate의 기본 설정(`config:base`)을 상속받아 사용합니다.
  - 참고: `config:base`는 `config:recommended`와 동일하며, 최근에는 `config:recommended` 사용이 권장됩니다.
  - 더 나아가 `config:best-practices`를 상속받으면 Renovate 팀이 제안하는 모범 사례 설정들이 적용되어 더욱 안전하고 효율적인 관리가 가능합니다.
- `timezone`: 스케줄링의 기준이 될 시간대를 한국 시간(`Asia/Seoul`)으로 설정합니다.
- `packageRules`: 패키지 업데이트 규칙을 정의합니다.
  - `matchUpdateTypes`: Minor 및 Patch 버전 업데이트만 대상으로 합니다.
  - `groupName`: 이 그룹에 속한 업데이트들을 하나의 PR로 묶어서 처리합니다 (예: "all non-major dependencies").
  - `schedule`: 매주 월요일 오전 9시 이전에만 해당 PR을 생성하도록 스케줄을 지정합니다.

이렇게 설정하면 평일 업무 시간에는 잦은 알림으로 방해받지 않고, 주초에 한 번에 의존성을 업데이트할 수 있어 효율적입니다.

## Renovate의 대안

Renovate 외에도 의존성 관리를 자동화할 수 있는 다른 도구들이 있습니다.

### npm-check-updates

CI/CD 파이프라인 연동 없이 **로컬 개발 환경**에서 가끔 한 번씩 의존성을 일괄 업데이트하고 싶을 때 유용한 CLI 도구입니다.

- **설치**: `npm install -g npm-check-updates`
- **사용**: `ncu` 명령어로 업데이트 가능한 패키지를 확인하고, `ncu -u`로 `package.json`을 업데이트한 뒤 `npm install`을 실행합니다.
- **장점**: 설정 파일 없이 즉시 사용할 수 있으며, 프로젝트 초기 세팅이나 대규모 업데이트가 필요할 때 빠르게 "싹 업데이트"하기 좋습니다.
- **단점**: 자동화된 도구가 아니므로 개발자가 주기적으로 직접 실행해야 합니다.

### GitHub Dependabot

GitHub에서 기본적으로 제공하는 의존성 관리 도구입니다.

- **장점**: GitHub에 내장되어 있어 별도의 설치나 가입 없이 설정(`dependabot.yml`)만으로 바로 사용할 수 있습니다. 보안 취약점(Security Advisory)에 대한 대응이 매우 빠릅니다.
- **단점**: Renovate에 비해 설정의 유연성이 다소 떨어질 수 있으며, 여러 패키지를 그룹화하여 PR을 보내는 기능(Grouping)이 상대적으로 제한적일 수 있습니다.

## 이미 Dependabot이 있는데 Renovate를 써야 할까요?

많은 프로젝트에서 이미 Dependabot을 사용하고 있습니다. 그럼에도 불구하고 Renovate로 전환하거나 추가하는 이유는 무엇일까요?

1.  **PR 노이즈 감소 (Grouping)**: Dependabot은 기본적으로 패키지 하나당 하나의 PR을 생성합니다. 의존성이 많은 프로젝트에서는 아침마다 수십 개의 PR 알림을 받을 수 있습니다. 이는 패키지별로 독립적인 테스트와 리뷰가 가능하다는 장점이 있지만, 관리해야 할 PR이 너무 많아지는 단점도 있습니다. 반면 Renovate는 앞선 설정 예시처럼 **관련된 패키지들을 하나의 PR로 묶거나**, **모든 Non-major 업데이트를 하나로 묶는 등** 강력한 그룹화 기능을 제공하여 피로도를 줄여줍니다. 물론 묶인 업데이트 중 특정 패키지만 문제가 발생한다면, 대시보드에서 해당 패키지만 분리하거나 `ignoreDeps` 설정으로 제외하는 등의 추가 작업이 필요할 수 있습니다.
2.  **Dependency Dashboard**: Renovate는 `Dependency Dashboard`라는 이슈를 생성하여 현재 업데이트 대기 중인 패키지, 무시된 패키지, 에러 로그 등을 한눈에 보여줍니다. 여기서 체크박스를 클릭하여 수동으로 PR 생성을 요청할 수도 있습니다.
3.  **정교한 설정과 프리셋**: Renovate는 매우 상세한 설정이 가능하며, `config:recommended` 같은 다양한 프리셋을 제공하여 복잡한 요구사항(예: 모노레포 환경, 특정 시간대 배포 등)을 충족시키기에 더 유리합니다.

결론적으로, **Dependabot은 "보안 패치"와 "개별 변경사항의 명확성"**에 강점이 있고, **Renovate는 "개발 생산성(PR 관리)"과 "운영의 유연성"**에 강점이 있습니다. 따라서 단순한 보안 업데이트만 필요하다면 Dependabot으로 충분하지만, 적극적으로 최신 버전을 유지하면서도 PR 관리 비용을 줄이고 싶다면 Renovate가 좋은 선택이 될 것입니다.

## 마치며

이제 Renovate가 주기적으로 의존성을 검사하고 업데이트가 필요한 패키지가 있으면 자동으로 PR을 생성해 줄 것입니다. 이를 통해 개발자는 비즈니스 로직 개발에 더 집중할 수 있게 되며, 항상 최신 상태의 안전한 의존성을 유지할 수 있습니다.
