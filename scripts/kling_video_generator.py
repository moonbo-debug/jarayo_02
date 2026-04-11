#!/usr/bin/env python3
"""
Kling.ai 영상 생성 자동화 스크립트
프롬프트 리스트를 받아 순차적으로 Kling.ai에서 영상을 생성합니다.
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

class KlingVideoGenerator:
    """Kling.ai 영상 생성 자동화 클래스"""

    def __init__(self, headless=False):
        """
        초기화

        Args:
            headless (bool): 브라우저 화면 숨김 여부
        """
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

            # Chrome 드라이버 시작
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
        """
        사용자 로그인 대기

        Args:
            timeout (int): 대기 시간 (초)
        """
        print("\n🔐 Kling.ai에 로그인해주세요.")
        print(f"   (로그인 창이 열렸습니다. {timeout}초 동안 로그인을 기다리고 있습니다.)")

        start_time = time.time()

        try:
            # 로그인 후 프롬프트 입력 페이지가 로드될 때까지 대기
            WebDriverWait(self.driver, timeout).until(
                lambda driver: len(driver.window_handles) > 0  # 페이지 유지
            )

            # 로그인 완료 대기 (URL 변경 또는 특정 요소 감지)
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
            # Kling.ai의 프롬프트 입력 필드를 찾는 여러 방식 시도
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
                    print(f"✅ 프롬프트 입력 필드 찾음: {selector}")
                    return element
                except TimeoutException:
                    continue

            print("⚠️ 프롬프트 입력 필드를 자동으로 찾지 못했습니다.")
            print("   페이지가 완전히 로드되었는지 확인하고 수동으로 진행해주세요.")
            return None

        except Exception as e:
            print(f"❌ 입력 필드 검색 중 오류: {e}")
            return None

    def input_prompt(self, prompt_text):
        """
        프롬프트 입력

        Args:
            prompt_text (str): 입력할 프롬프트 텍스트
        """
        try:
            # 입력 필드 찾기
            input_field = self.find_prompt_input_field()

            if input_field is None:
                print("\n⚠️ 프롬프트를 수동으로 입력해주세요.")
                print(f"프롬프트: {prompt_text}")
                input("프롬프트 입력을 완료한 후 엔터를 누르세요...")
                return True

            # 프롬프트 입력
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
        """
        영상 생성 완료 대기

        Args:
            prompt_number (int): 프롬프트 번호 (진행상황 표시용)
            timeout (int): 대기 시간 (기본값: 10분)
        """
        if timeout is None:
            timeout = self.wait_timeout

        start_time = time.time()

        print(f"\n⏳ 영상 생성 중... (타임아웃: {timeout}초)")

        try:
            # 생성 완료 감지 (여러 방식 시도)
            while time.time() - start_time < timeout:
                try:
                    # 생성 완료 페이지 요소 찾기
                    page_source = self.driver.page_source.lower()

                    # 완료 표시 감지
                    if any(keyword in page_source for keyword in ['generate', 'download', 'complete', '완료']):
                        # 추가 확인: 로딩 인디케이터가 없는지 확인
                        try:
                            self.driver.find_element(By.CSS_SELECTOR, '.loading')
                            time.sleep(5)
                            continue
                        except NoSuchElementException:
                            pass

                        elapsed = time.time() - start_time
                        print(f"✅ 영상 생성 완료! (소요 시간: {int(elapsed)}초)")
                        return True

                    # 진행 상황 표시
                    elapsed = time.time() - start_time
                    if int(elapsed) % 30 == 0:
                        print(f"   진행 중... ({int(elapsed)}초 경과)")

                    time.sleep(5)

                except Exception as e:
                    print(f"   [체크 중] {str(e)[:50]}")
                    time.sleep(5)

            # 타임아웃 발생
            print(f"⚠️ {timeout}초 내에 생성이 완료되지 않았습니다.")
            print("   생성이 진행 중일 수 있습니다. 계속 기다리시겠습니까?")
            response = input("계속 기다리기 (y/n): ").lower()

            if response == 'y':
                return self.wait_for_generation_complete(
                    prompt_number,
                    timeout=int(timeout/2)  # 추가로 5분 대기
                )
            else:
                return False

        except Exception as e:
            print(f"❌ 생성 완료 대기 중 오류: {e}")
            return False

    def process_prompt(self, prompt_text, prompt_number, total_prompts):
        """
        단일 프롬프트 처리

        Args:
            prompt_text (str): 프롬프트 텍스트
            prompt_number (int): 프롬프트 번호
            total_prompts (int): 총 프롬프트 개수

        Returns:
            dict: 처리 결과
        """
        print(f"\n{'='*60}")
        print(f"[{prompt_number}/{total_prompts}] 프롬프트 처리 중")
        print(f"{'='*60}")

        start_time = time.time()

        try:
            # 프롬프트 입력
            if not self.input_prompt(prompt_text):
                return {
                    'prompt_number': prompt_number,
                    'status': 'failed',
                    'error': '프롬프트 입력 실패',
                    'time_elapsed': time.time() - start_time
                }

            # 생성 버튼 클릭
            if not self.click_generate_button():
                return {
                    'prompt_number': prompt_number,
                    'status': 'failed',
                    'error': '생성 버튼 클릭 실패',
                    'time_elapsed': time.time() - start_time
                }

            # 생성 완료 대기
            if self.wait_for_generation_complete(prompt_number):
                elapsed = time.time() - start_time
                return {
                    'prompt_number': prompt_number,
                    'status': 'completed',
                    'time_elapsed': elapsed
                }
            else:
                elapsed = time.time() - start_time
                return {
                    'prompt_number': prompt_number,
                    'status': 'timeout',
                    'error': '생성 타임아웃',
                    'time_elapsed': elapsed
                }

        except Exception as e:
            return {
                'prompt_number': prompt_number,
                'status': 'error',
                'error': str(e),
                'time_elapsed': time.time() - start_time
            }

    def process_prompts(self, prompts):
        """
        프롬프트 리스트 순차 처리

        Args:
            prompts (list): 프롬프트 텍스트 리스트

        Returns:
            list: 처리 결과 리스트
        """
        self.results = []

        # 브라우저 시작
        if not self.start_browser():
            return self.results

        # Kling.ai 접속
        if not self.navigate_to_kling():
            return self.results

        # 로그인 대기
        if not self.wait_for_login():
            return self.results

        # 프롬프트 처리
        total = len(prompts)
        for i, prompt in enumerate(prompts, 1):
            result = self.process_prompt(prompt, i, total)
            self.results.append(result)

            # 마지막 프롬프트 제외 후 대기
            if i < total:
                print("\n⏳ 다음 프롬프트 처리 준비 중... (3초 대기)")
                time.sleep(3)

        return self.results

    def print_summary(self):
        """처리 결과 요약 출력"""
        if not self.results:
            print("처리 결과가 없습니다.")
            return

        print(f"\n{'='*60}")
        print("📊 처리 완료 요약")
        print(f"{'='*60}")

        completed = sum(1 for r in self.results if r['status'] == 'completed')
        failed = sum(1 for r in self.results if r['status'] != 'completed')
        total_time = sum(r['time_elapsed'] for r in self.results)

        print(f"\n✅ 완료: {completed}/{len(self.results)}")
        print(f"❌ 실패: {failed}/{len(self.results)}")
        print(f"⏱️  총 소요 시간: {int(total_time)}초 ({int(total_time/60)}분 {int(total_time%60)}초)")

        print(f"\n{'프롬프트':<12} {'상태':<12} {'소요 시간':<15}")
        print("-" * 40)

        for result in self.results:
            status_emoji = "✅" if result['status'] == 'completed' else "❌"
            status_text = result['status'].upper()
            time_text = f"{int(result['time_elapsed'])}초"

            print(f"[{result['prompt_number']:>2}]        {status_emoji} {status_text:<10} {time_text:>14}")

        print(f"{'='*60}\n")

    def close(self):
        """브라우저 종료"""
        if self.driver:
            self.driver.quit()
            print("🔌 브라우저 종료됨")


def main():
    """메인 함수"""
    print("\n🎬 Kling.ai 영상 생성 자동화")
    print("=" * 60)

    # 프롬프트 입력받기
    print("\n프롬프트를 입력하세요 (한 줄씩, 빈 줄로 종료):")
    prompts = []

    while True:
        line = input().strip()
        if not line:
            break
        prompts.append(line)

    if not prompts:
        print("❌ 프롬프트를 입력해주세요.")
        return

    print(f"\n📝 입력된 프롬프트: {len(prompts)}개")
    for i, prompt in enumerate(prompts, 1):
        print(f"   {i}. {prompt[:50]}..." if len(prompt) > 50 else f"   {i}. {prompt}")

    # 시작 확인
    confirm = input("\n시작하시겠습니까? (y/n): ").lower()
    if confirm != 'y':
        print("작업이 취소되었습니다.")
        return

    # 생성 시작
    generator = KlingVideoGenerator(headless=False)

    try:
        generator.process_prompts(prompts)
        generator.print_summary()
    finally:
        generator.close()


if __name__ == "__main__":
    main()
