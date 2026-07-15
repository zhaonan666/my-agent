"use client";

import { useState } from "react";
import InputContainer from "./_componets/InputContainer";
import LeftBar from "./_componets/LeftBar";
import MessageContainer from "./_componets/MessageContainer";
import { Message } from "./_componets/_types/chat";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        '插入排序（Insertion Sort）也是一种简单直观的排序算法。它的核心思想非常贴近我们的日常生活。 ### 1. 通俗理解（打扑克牌） 想象你在打扑克牌，左手拿着已经理好顺序的牌，右手从牌堆里摸一张新牌。你会把这张新牌**从右向左**与左手的牌依次比较，找到合适的位置**插进去**。 插入排序的过程就和整理手牌一模一样：将数组分为 **“已排序”** 和 **“未排序”** 两部分，每次从“未排序”中拿出一个元素，插入到“已排序”部分的正确位置。 --- ### 2. 核心步骤 1. 将数组的第一个元素视为“已排序”部分，剩下的元素视为“未排序”部分。 2. 从“未排序”部分取出第一个元素（记为 `key`）。 3. 在“已排序”部分中**从后向前**扫描，将扫描到的元素与 `key` 进行比较。 4. 如果已排序的元素大于 `key`，则将该元素**向后移动一位**，腾出空间。 5. 重复步骤4，直到找到一个小于或等于 `key` 的元素，或者扫描到数组头部。 6. 将 `key` 插入到找到的空位中。 7. 重复步骤2-6，直到所有元素都处理完毕。 --- ### 3. Python 代码实现 ```python def insertion_sort(arr): n = len(arr) # 从第二个元素（索引1）开始遍历，因为第一个元素默认已排序 for i in range(1, n): key = arr[i] # 当前需要插入的元素（相当于右手摸到的牌） j = i - 1 # j 指向已排序部分的最后一个元素 # 从后向前扫描已排序部分 # 条件：j 没有越界，且 已排序元素 大于 当前元素 key while j >= 0 and arr[j] > key: arr[j + 1] = arr[j] # 将较大的元素向后移动一位 j -= 1 # 继续向前比较 # 找到合适的位置，将 key 插入 arr[j + 1] = key return arr # 测试代码 my_list = [12, 11, 13, 5, 6] print("排序前:", my_list) sorted_list = insertion_sort(my_list) print("排序后:", sorted_list) ``` --- ### 4. 其他主流编程语言实现 #### ☕ Java 实现 ```java public class InsertionSort { public static void insertionSort(int[] arr) { int n = arr.length; for (int i = 1; i < n; i++) { int key = arr[i]; int j = i - 1; // 从后向前扫描，移动大于 key 的元素 while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; } arr[j + 1] = key; // 插入 } } } ``` #### ⚙️ C++ 实现 ```cpp #include <vector> void insertionSort(std::vector<int>& arr) { int n = arr.size(); for (int i = 1; i < n; ++i) { int key = arr[i]; int j = i - 1; while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; --j; } arr[j + 1] = key; } } ``` --- ### 5. 复杂度分析 * **时间复杂度**： * **最好情况**：$O(n)$。当输入数组**已经是有序**时，内层的 `while` 循环条件 `arr[j] > key` 永远不成立，不需要移动任何元素，只需遍历一次。 * **最坏情况**：$O(n^2)$。当输入数组是**逆序**时，每次插入都需要比较和移动所有已排序的元素。 * **平均情况**：$O(n^2)$。 * **空间复杂度**：$O(1)$。只需要常数级别的额外空间（`key` 和 `j`），属于**原地排序**。 * **稳定性**：**稳定**。在比较时，只有当 `arr[j] > key` 时才移动元素，相等的元素不会改变相对顺序。 --- ### 6. 优缺点与适用场景 * **优点**： * 实现简单，逻辑清晰。 * 对于**小规模数据**或**基本有序的数据**，效率非常高（甚至优于快速排序等 $O(n \log n)$ 的算法，因为它的常数因子很小）。 * 是稳定排序，且空间复杂度低。 * **缺点**： * 对于大规模且无序的数据，$O(n^2)$ 的时间复杂度使其效率低下。 * **实际应用**： * 在很多高级排序算法（如快速排序、归并排序）的底层实现中，当递归到**子数组规模较小**（例如长度小于 10~15）时，通常会**切换为插入排序**，以提高整体性能（例如 Java 的 `Arrays.sort()` 和 Python 的 `Timsort` 都利用了插入排序的思想）。 如果您对其中某一步骤（比如 `arr[j + 1] = key` 为什么是 `j + 1`）有疑问，或者想了解其他排序算法，随时告诉我！',
    },
  ]);
  return (
    <div className="flex h-dvh w-screen overflow-hidden">
      <LeftBar />
      <div className="min-w-0 flex-1">
        <div className="mx-auto flex h-full min-h-0 w-3/4 flex-col">
          <MessageContainer messages={messages} />

          <InputContainer setMessages={setMessages} />
        </div>
      </div>
    </div>
  );
}
