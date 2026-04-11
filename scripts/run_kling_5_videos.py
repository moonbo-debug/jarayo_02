#!/usr/bin/env python3
"""
Kling.ai 5개 영상 자동 생성 스크립트 (EP1 4개 + EP2 1개)
"""

import time
import sys
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

# 5개 프롬프트 정의
PROMPTS = [
    {
        'episode': 'EP1',
        'scene': '씬 1-1',
        'title': '정혼식 준비',
        'prompt': '반짝이는 산호와 보석으로 장식된 화려한 인어 궁전의 광장. 푸른 물빛이 흘러들어오는 천장 창으로 은빛 햇빛이 내려온다. 긴 흰색 머리를 한 우아한 인어왕자가 화려한 파란 비늘 궁전복으로 엄숙하게 서 있다. 하지만 그의 표정은 깊은 걱정과 불안감으로 가득하다. 카메라는 천천히 옆에서 앞으로 이동하며 왕자의 불안한 얼굴을 클로즈업한다. 배경음악은 섬세하고 불안한 현악기 선율. 색감은 깊은 파란색과 은빛이 어둡고 차갑게 어울린다.'
    },
    {
        'episode': 'EP1',
        'scene': '씬 1-2',
        'title': '인간여자 구조',
        'prompt': '밤의 해변 근처 바다. 파도가 격렬하게 치고 있고, 검은 하늘과 어두운 바다가 표현된다. 인간 여자가 물에 빠져 흘러내려간다. 긴 갈색 머리와 하얀 원피스를 입은 여자. 긴 흰색 머리를 한 인어왕자가 빠르게 수심 속에서 그녀를 향해 헤엄친다. 그의 파란 비늘이 빛난다. 카메라는 동적으로 원형으로 회전하며 구조 장면의 긴장감을 표현한다. 색감은 어두운 파란색과 검은색. 음향은 긴박한 드라마틱한 오케스트라 음악. 마지막 순간 왕자가 여자를 팔로 감싼다.'
    },
    {
        'episode': 'EP1',
        'scene': '씬 1-3',
        'title': '왕궁으로 돌아옴',
        'prompt': '화려한 궁전 방으로 돌아온 인어왕자. 밝은 파란색 벽과 보석으로 장식된 내부. 정약혼자인 다른 나라의 인어공주가 기대에 찬 미소로 서 있다. 공주는 검은 비늘의 화려한 궁전복을 입고 있다. 인어왕자는 여전히 해변에서 구한 인간여자를 생각하고 있으며, 공주의 환영을 받으면서도 마음이 여기 있지 않다. 카메라는 슬로우 모션으로 두 인어 사이의 거리감을 표현한다. 색감은 밝은 파란색과 화려한 금색. 배경음악은 궁전의 클래식하고 우아한 현악기. 왕자의 눈은 어딘가 먼 곳을 바라본다.'
    },
    {
        'episode': 'EP1',
        'scene': '씬 1-4',
        'title': '몰래 해변 방문',
        'prompt': '밤의 해변. 백사장과 부드러운 파도. 인간여자가 혼자 서 있고, 인어왕자가 물에서 천천히 나타난다. 긴 흰색 머리가 물에 젖어 흘러내린다. 두 사람의 눈이 만나고, 말 없이 서로를 바라본다. 하늘 가득한 별들이 그들을 비추고 있다. 부드러운 황금빛이 해변 모래에 반사된다. 카메라는 천천히 양쪽을 번갈아가며 클로즈업하며 감정의 교류를 표현한다. 음향은 부드럽고 신비로운 현악기 음악. 색감은 어두운 파란색과 황금빛의 따뜻함이 어우러진다. 마지막 순간, 왕자가 여자에게 손을 뻗는다.'
    },
    {
        'episode': 'EP2',
        'scene': '씬 2-1',
        'title': '해변에서의 비밀 만남',
        'prompt': '황혼 무렵의 해변. 따뜻한 황금색 햇빛이 수평선을 물들인다. 하얀 원피스를 입은 갈색 머리의 인간여자가 모래 위에 앉아 있고, 긴 흰색 머리의 인어왕자가 얕은 물에서 나타난다. 두 사람이 마주보며 앉는다. 따뜻한 바람이 그들의 머리를 날린다. 카메라는 천천히 양쪽을 비추며 감정의 교류를 표현한다. 색감은 따뜻한 황금색과 부드러운 주황색. 배경음악은 낭만적이고 부드러운 현악기. 분위기는 로맨틱하고 평화로움. 두 사람의 표정에서 행복이 묻어난다.'
    }
]


class KlingVideoGenerator:
    """Kling.ai 영상 생성 자동화 클래스"""

    def __init__(self, headless=False):
        self.driver = None
        self.headless = headless
        self.wait_timeout = 600  # 10분
        self.results = []

    def start_browser(self):
        """Chrome 브라우저 시작"""
        try:
            chrome_options = webdriver.ChromeOptions()

            if self.headless:
                chrome_options.add_argument("--headless")

            # 자동화 감지 회피
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)

            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)

            print("✅ Chrome 브라우저 시작됨")
            return True

        except Exception as e:
            print(f"❌ 브라우저 시작 실패: {e}")
            return False

    def navigate_to_kling(self):
        """Kling.ai로 이동"""
        try:
            print("\n🌐 Kling.ai 접속 중...")
            self.driver.get("https://kling.ai")
            time.sleep(3)
            print("✅ Kling.ai 접속 완료")
            return True

        except Exception as e:
            print(f"❌ Kling.ai 접속 실패: {e}")
            return False

    def wait_for_login(self, timeout=300):
        """사용자 로그인 대기"""
        print("\n🔐 Kling.ai에 로그인해주세요.")
        print(f"   (로그인 창이 열렸습니다. {timeout}초 동안 로그인을 기다리고 있습니다.)")

        start_time = time.time()

        try:
            WebDriverWait(self.driver, timeout).until(
                lambda driver: len(driver.window_handles) > 0
            )
            time.sleep(3)

            elapsed = time.time() - start_time
            print(f"✅ 로그인 감지됨 (소요 시간: {int(elapsed)}초)")
            return True

        except TimeoutException:
            print(f"⚠️ {timeout}초 내에 로그인이 완료되지 않았습니다.")
            input("로그인을 완료한 후 엔터를 누르세요...")
            return True

    def find_prompt_input_field(self):
        """프롬프트 입력 필드 찾기"""
        try:
            possible_selectors = [
                (By.CSS_SELECTOR, 'textarea[placeholder*="prompt"]'),
                (By.CSS_SELECTOR, 'input[placeholder*="prompt"]'),
                (By.CSS_SELECTOR, 'textarea'),
                (By.CSS_SELECTOR, '[contenteditable="true"]'),
                (By.ID, 'prompt-input'),
                (By.CLASS_NAME, 'prompt-input'),
            ]

            for by, selector in possible_selectors:
                try:
                    element = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((by, selector))
                    )
                    return element
                except TimeoutException:
                    continue

            print("⚠️ 프롬프트 입력 필드를 자동으로 찾지 못했습니다.")
            return None

        except Exception as e:
            print(f"❌ 입력 필드 검색 중 오류: {e}")
            return None

    def input_prompt(self, prompt_text):
        """프롬프트 입력"""
        try:
            input_field = self.find_prompt_input_field()

            if input_field is None:
                print("\n⚠️ 프롬프트를 수동으로 입력해주세요.")
                print(f"프롬프트: {prompt_text[:100]}...")
                input("프롬프트 입력을 완료한 후 엔터를 누르세요...")
                return True

            input_field.clear()
            input_field.send_keys(prompt_text)
            print(f"✅ 프롬프트 입력 완료 (길이: {len(prompt_text)}자)")
            time.sleep(1)
            return True

        except Exception as e:
            print(f"❌ 프롬프트 입력 실패: {e}")
            return False

    def click_generate_button(self):
        """생성 버튼 클릭"""
        try:
            possible_buttons = [
                (By.XPATH, "//button[contains(text(), 'Generate')]"),
                (By.XPATH, "//button[contains(text(), 'Create')]"),
                (By.XPATH, "//button[contains(text(), '생성')]"),
                (By.CSS_SELECTOR, 'button[type="submit"]'),
                (By.CLASS_NAME, 'generate-btn'),
                (By.CLASS_NAME, 'create-btn'),
            ]

            for by, selector in possible_buttons:
                try:
                    button = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((by, selector))
                    )
                    button.click()
                    print("✅ 생성 버튼 클릭 완료")
                    time.sleep(2)
                    return True
                except:
                    continue

            print("⚠️ 생성 버튼을 자동으로 찾지 못했습니다. 수동으로 생성해주세요.")
            input("생성을 시작한 후 엔터를 누르세요...")
            return True

        except Exception as e:
            print(f"❌ 생성 버튼 클릭 실패: {e}")
            return False

    def wait_for_generation_complete(self, prompt_number, timeout=None):
        """영상 생성 완료 대기"""
        if timeout is None:
            timeout = self.wait_timeout

        start_time = time.time()
        print(f"\n⏳ 영상 생성 중... (타임아웃: {timeout}초)")

        try:
            while time.time() - start_time < timeout:
                try:
                    page_source = self.driver.page_source.lower()

                    if any(keyword in page_source for keyword in ['generate', 'download', 'complete', '완료']):
                        try:
                            self.driver.find_element(By.CSS_SELECTOR, '.loading')
                            time.sleep(5)
                            continue
                        except NoSuchElementException:
                            pass

                        elapsed = time.time() - start_time
                        print(f"✅ 영상 생성 완료! (소요 시간: {int(elapsed)}초)")
                        return True

                    elapsed = time.time() - start_time
                    if int(elapsed) % 30 == 0:
                        print(f"   진행 중... ({int(elapsed)}초 경과)")

                    time.sleep(5)

                except Exception as e:
                    time.sleep(5)

            print(f"⚠️ {timeout}초 내에 생성이 완료되지 않았습니다.")
            response = input("계속 기다리기 (y/n): ").lower()

            if response == 'y':
                return self.wait_for_generation_complete(
                    prompt_number,
                    timeout=int(timeout/2)
                )
            else:
                return False

        except Exception as e:
            print(f"❌ 생성 완료 대기 중 오류: {e}")
            return False

    def process_prompt(self, prompt_data, prompt_number, total_prompts):
        """단일 프롬프트 처리"""
        print(f"\n{'='*60}")
        print(f"[{prompt_number}/{total_prompts}] {prompt_data['episode']} - {prompt_data['scene']}: {prompt_data['title']}")
        print(f"{'='*60}")

        start_time = time.time()

        try:
            if not self.input_prompt(prompt_data['prompt']):
                return {
                    'prompt_number': prompt_number,
                    'episode': prompt_data['episode'],
                    'scene': prompt_data['scene'],
                    'status': 'failed',
                    'error': '프롬프트 입력 실패',
                    'time_elapsed': time.time() - start_time
                }

            if not self.click_generate_button():
                return {
                    'prompt_number': prompt_number,
                    'episode': prompt_data['episode'],
                    'scene': prompt_data['scene'],
                    'status': 'failed',
                    'error': '생성 버튼 클릭 실패',
                    'time_elapsed': time.time() - start_time
                }

            if self.wait_for_generation_complete(prompt_number):
                elapsed = time.time() - start_time
                return {
                    'prompt_number': prompt_number,
                    'episode': prompt_data['episode'],
                    'scene': prompt_data['scene'],
                    'status': 'completed',
                    'time_elapsed': elapsed
                }
            else:
                elapsed = time.time() - start_time
                return {
                    'prompt_number': prompt_number,
                    'episode': prompt_data['episode'],
                    'scene': prompt_data['scene'],
                    'status': 'timeout',
                    'error': '생성 타임아웃',
                    'time_elapsed': elapsed
                }

        except Exception as e:
            return {
                'prompt_number': prompt_number,
                'episode': prompt_data['episode'],
                'scene': prompt_data['scene'],
                'status': 'error',
                'error': str(e),
                'time_elapsed': time.time() - start_time
            }

    def process_prompts(self, prompts):
        """프롬프트 리스트 순차 처리"""
        self.results = []

        if not self.start_browser():
            return self.results

        if not self.navigate_to_kling():
            return self.results

        if not self.wait_for_login():
            return self.results

        total = len(prompts)
        for i, prompt_data in enumerate(prompts, 1):
            result = self.process_prompt(prompt_data, i, total)
            self.results.append(result)

            if i < total:
                print("\n⏳ 다음 프롬프트 처리 준비 중... (3초 대기)")
                time.sleep(3)

        return self.results

    def print_summary(self):
        """처리 결과 요약 출력"""
        if not self.results:
            print("처리 결과가 없습니다.")
            return

        print(f"\n{'='*70}")
        print("📊 5개 영상 생성 완료 요약")
        print(f"{'='*70}")

        completed = sum(1 for r in self.results if r['status'] == 'completed')
        failed = sum(1 for r in self.results if r['status'] != 'completed')
        total_time = sum(r['time_elapsed'] for r in self.results)

        print(f"\n✅ 완료: {completed}/{len(self.results)}")
        print(f"❌ 실패: {failed}/{len(self.results)}")
        print(f"⏱️  총 소요 시간: {int(total_time)}초 ({int(total_time/60)}분 {int(total_time%60)}초)")

        print(f"\n{'에피소드':<8} {'씬':<12} {'상태':<12} {'소요 시간':<15}")
        print("-" * 50)

        for result in self.results:
            status_emoji = "✅" if result['status'] == 'completed' else "❌"
            status_text = result['status'].upper()
            time_text = f"{int(result['time_elapsed'])}초"

            print(f"{result['episode']:<8} {result['scene']:<12} {status_emoji} {status_text:<10} {time_text:>14}")

        print(f"{'='*70}\n")

    def close(self):
        """브라우저 종료"""
        if self.driver:
            self.driver.quit()
            print("🔌 브라우저 종료됨")


def main():
    """메인 함수"""
    print("\n" + "="*70)
    print("🎬 인어왕자 - Kling.ai 5개 영상 자동 생성")
    print("="*70)
    print("\n📝 생성할 영상:")
    print("   • EP1 씬 1-1: 정혼식 준비")
    print("   • EP1 씬 1-2: 인간여자 구소")
    print("   • EP1 씬 1-3: 왕궁으로 돌아옴")
    print("   • EP1 씬 1-4: 몰래 해변 방문")
    print("   • EP2 씬 2-1: 해변에서의 비밀 만남")
    print("\n⏱️  예상 소요 시간: 15~25분 (약 20분)")

    confirm = input("\n시작하시겠습니까? (y/n): ").lower()
    if confirm != 'y':
        print("작업이 취소되었습니다.")
        return

    # 생성 시작
    generator = KlingVideoGenerator(headless=False)

    try:
        generator.process_prompts(PROMPTS)
        generator.print_summary()
    finally:
        generator.close()


if __name__ == "__main__":
    main()
