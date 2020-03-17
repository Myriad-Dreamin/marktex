export const math_md: string = '## 误差分析\n\n误差来源\n\n+ 模型误差\n+ 观测误差\n+ 截断误差\n+ 舍入误差\n\n《数值分析》\n\n理论\n\n+ 绝对误差\n  $\\delta(a) = x - a, |\\delta (a)| \\leqslant \\Delta (a)$';

export const math_md2: string = '' +
    '$$\n' +
    'T(n)=\\sum_{i=1}^{n}\\gro(i)=\\gro(n^2).\n' +
    '$$';

export const code_md: string = '`a` is ``b``\n' +
    '\n' +
    '    dd\n' +
    '      ee\n' +
    '\n' +
    '```\n' +
    'c\n' +
    '\n' +
    '  qwq\n' +
    '```';

export const latex_md: string = '' +
    '\\newcommand{\\brc}[1]{\\left({#1}\\right)}\n' +
    '\\newcommand{\\brm}[1]{\\left[{#1}\\right]}\n' +
    '\\newcommand{\\brv}[1]{\\left|{#1}\\right|}\n' +
    '\\newcommand{\\brf}[1]{\\left\\{{#1}\\right\\}}\n' +
    '\\newcommand{\\brt}[1]{\\left\\Vert{#1}\\right\\Vert}\n' +
    '\\newcommand{\\brg}[1]{\\left<{#1}\\right>}\n' +
    '\\newcommand{\\floor}[1]{\\lfloor{#1}\\rfloor}\n' +
    '\\newcommand{\\ceil}[1]{\\lceil{#1}\\rceil}\n' +
    '\\newcommand{\\fira}[1]{{\\firacode #1}}\n' +
    '\\newcommand{\\ds}{\\displaystyle}\n' +
    '\\newcommand{\\pt}{\\partial}\n' +
    '\\newcommand{\\rint}[2]{\\Big|^{#1}_{#2}}\n' +
    '\\newcommand{\\leg}{\\left\\lgroup}\n' +
    '\\newcommand{\\rig}{\\right\\rgroup}\n' +
    '\\newcommand{\\de}{\\mathrm{d}}\n' +
    '\\newcommand{\\im}{\\mathrm{im}}\n' +
    '\\newcommand{\\ord}{\\mathrm{ord}}\n' +
    '\\newcommand{\\cov}{\\mathrm{Cov}}\n' +
    '\\newcommand{\\lub}{\\mathrm{LUB}}\n' +
    '\\newcommand{\\glb}{\\mathrm{GLB}}\n' +
    '\\newcommand{\\var}{\\mathrm{Var}}\n' +
    '\\newcommand{\\aut}{\\mathrm{Aut}}\n' +
    '\\newcommand{\\sylow}{\\mathrm{Sylow}}\n' +
    '\\newcommand{\\xhi}{\\mathcal{X}}\n' +
    '\\newcommand{\\po}{\\mathcal{P}}\n' +
    '\\newcommand{\\bi}{\\mathrm{b}}\n' +
    '\\newcommand{\\rfl}{\\mathcal{R}}\n' +
    '\\newcommand{\\gro}{\\mathrm{O}}\n' +
    '\\newcommand{\\hfindent}{\\hspace*{1em}}' +
    '' +
    '\\subsection{约定}\n' +
    '\\subsubsection{数组和数组的长度}\n' +
    '$A[1...n]=[A[1]...A[n]](n>=1)$总是表示一个数组,$len[A]=n$总是表示一个数组的长度.\n' +
    '\\subsubsection{数组切片}\n' +
    '若$A[l...r]$出现$l>r$,则$A[l...r]=\\varnothing$,否则$A[l...r]=[A[l],\\dots,A[r]]$.\n' +
    '\\subsubsection{时间复杂度表示}\n' +
    '我们用$T(n)$表示某一次特定的数据集$\\mathcal{S}$该算法的时间复杂度,如无指定,则$T(n)$表示一般情况的时间复杂度.\n' +
    '\\subsubsection{对数表示}\n' +
    '$\\log n:=\\log_2 n,\\lg n := \\log_{10} n, \\ln n := \\log_{e}n$.\n' +
    '\\subsubsection{测试环境}\n' +
    'CPU主频3.2GHz,程序限制使用10\\%的CPU资源.内存16G,测试系统为windows10x64.\n' +
    '\\subsubsection{源代码}\n' +
    'GitHub:\\url{https://github.com/Myriad-Dreamin/Sort-Comparsion}\n' +
    '\\section{插入排序 $\\mathrm{InsertionSort}$}\n' +
    '对于$[1...i](i\\leqslant n)$将$A[i]$从后往前依次挪动找到一个恰保证有序的位置，视为结束一次插入.\n' +
    '\\subsection{正确性}\n' +
    '采用数学归纳法.\n' +
    '\\indent\n' +
    '假设:\n' +
    '\\indent\n' +
    '定义$\\mathrm{Insert}(x,A[l...r])$为插入操作,它不破坏$A[l...r]$之间的相对关系,并将$A[l...r]$分为$A_{lo}=A[l...x-1],A[x],A_{hi}=A[x+1...r]$,满足$\\forall y\\in A_{lo}, y<A[x], \\forall y\\in A_{hi}, A[x] < y$,这时$A\' = [A[l...x-1], A[x],A[x+1...r]]$为有序的.\n' +
    '\\subsection{算法复杂度}\n' +
    '该排序为原地排序.\n' +
    '\\indent\n' +
    '当我们朴素地按照定义实现$\\mathrm{Insert}$时.它的复杂度是$\\Omega(1),\\gro(n)$的,那么:\n' +
    '\\indent\n' +
    '空间复杂度为$\\Theta(1)$,时间复杂度为$\\Omega(n),\\gro(n^2)$.\n' +
    '\\subsubsection{最好情况举例}\n' +
    '\\indent\n' +
    '设$A[1...n]= [1,2,...,n]$,有每次$\\mathrm{Insert}$的复杂度为$\\Theta(1)$,因此$T(n)=n\\Theta(1)=\\Theta(n)$.\n' +
    '\\subsubsection{最差情况举例}\n' +
    '\\indent\n' +
    '设$A[1...n]= [n,n-1,...,1]$,有每次$\\mathrm{Insert}$的复杂度为$\\Theta(i)(1\\leqslant i \\leqslant n)$,因此:$$\n' +
    '    T(n)=\\sum_{i=1}^{n}\\Theta(i)=\\Theta(n^2).\n' +
    '$$\n' +
    '\\indent\n' +
    '\\subsubsection{平均情况}\n' +
    '\\indent\n' +
    '设$A[1...n]$为随机数据.那么$\\mathrm{Insert}$的移动期望为$O(\\dfrac{i}{2})=O(i)(1\\leqslant i \\leqslant n)$.\n' +
    '从而估计的平均时间复杂度为:\n' +
    '$$\n' +
    'T(n)=\\sum_{i=1}^{n}\\gro(i)=\\gro(n^2).\n' +
    '$$\n';

export const cn_book_md: string = '## [The Cathedral and the Bazaar](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/index.html#catbmain)\n' +
    '\n' +
    '作者: Eric Steven Raymond\n' +
    '\n' +
    '#### Abstract\n' +
    '\n' +
    '#### 概要\n' +
    '\n' +
    'I anatomize a successful open-source project, fetchmail, that was run as a deliberate test of the surprising theories about software engineering suggested by the history of Linux. I discuss these theories in terms of two fundamentally different development styles, the \'\'cathedral\'\' model of most of the commercial world versus the \'\'bazaar\'\' model of the Linux world. I show that these models derive from opposing assumptions about the nature of the software-debugging task. I then make a sustained argument from the Linux experience for the proposition that \'\'Given enough eyeballs, all bugs are shallow\'\', suggest productive analogies with other self-correcting systems of selfish agents, and conclude with some exploration of the implications of this insight for the future of software.\n' +
    '\n' +
    'anatomize 详细分析; 剖析;\n' +
    '\n' +
    'deliberate 故意的; 蓄意的; 存心的; 不慌不忙的; 小心翼翼的; 从容不迫的;\n' +
    '\n' +
    'bazaar (某些东方国家的) 集市; (英、美等国的) 义卖;\n' +
    '\n' +
    'sustained 维持(生命、生存); 使保持; 使稳定持续; 遭受; 蒙受; 经受;\n' +
    '\n' +
    'eyeball 眼球; 眼珠;\n' +
    '\n' +
    'analogy 类比; 比拟; 比喻; 类推;\n' +
    '\n' +
    'implication 可能的影响(或作用、结果); 含意; 暗指; (被) 牵连，牵涉;\n' +
    '\n' +
    '我剖析了一个成功的开源项目fetchmail，该项目践行了由Linux引出的各种有关软件工程的惊人理论。我将以两个完全不同的开发模式来讨论这些理论，即大多数商业项目的"大教堂"模型与Linux社区的"集市"模型。我们将看到这两个模式来源于软件调试生产活动中相互对立的假设。然后，我从Linux经验中得出一个坚实论点，即``只要有足够多的人参与，那么任何错误(bug)都无所遁形\'\'，并与其他自主研发的自纠错系统（项目）做一个比较，最后，我将探讨其中蕴含的一些工业界未来各种启示。\n' +
    '\n' +
    '#### The Cathedral and the Bazaar\n' +
    '\n' +
    '#### 大教堂和集市\n' +
    '\n' +
    'Linux is subversive. Who would have thought even five years ago (1991) that a world-class operating system could coalesce as if by magic out of part-time hacking by several thousand developers scattered all over the planet, connected only by the tenuous strands of the Internet?\n' +
    '\n' +
    'subversive 颠覆性的; 暗中起破坏作用的;\n' +
    '\n' +
    'coalesce 合并; 联合; 结合;\n' +
    '\n' +
    'scattered 分散的; 零散的; 疏落的;\n' +
    '\n' +
    'tenuous 脆弱的; 微弱的; 缥缈的; 纤细的; 薄的; 易断的;\n' +
    '\n' +
    'strands (线、绳、金属线、毛发等的) 股，缕; (观点、计划、故事等的) 部分，方面; (海洋、湖或河的) 岸，滨;\n' +
    '\n' +
    'Linux是一个颠覆性的系统。谁能想到就是在五年前(1991)，来自世界各地的几千名开发者梦幻般地搭建起了一个世界级的操作系统。而这些开发者的协同工作，仅仅依靠于一个飘渺的虚幻的互联网。\n' +
    '\n' +
    'Certainly not I. By the time Linux swam onto my radar screen in early 1993, I had already been involved in Unix and open-source development for ten years. I was one of the first GNU contributors in the mid-1980s. I had released a good deal of open-source software onto the net, developing or co-developing several programs (nethack, Emacs\'s VC and GUD modes, xlife, and others) that are still in wide use today. I thought I knew how it was done.\n' +
    '\n' +
    'radar screen 雷达荧光屏（幕）; (公众的) 关注范围;\n' +
    '\n' +
    '当然这不是我的杰作。1993年的上半年我刚开始关注Linux的时候，我已经在Unix和开源领域活跃了几十年。1980年代中期，我是最早的一批GNU贡献者的一员。我已经在网络上发布了一系列不错的开源软件。这些软件帮助了几个至今还在用的项目（nethack, Emacs\'s VC and GUD modes, xlife以及其他）。我那时认为我已经知晓应该如何从事开源项目开发了。\n' +
    '\n' +
    'Linux overturned much of what I thought I knew. I had been preaching the Unix gospel of small tools, rapid prototyping and evolutionary programming for years. But I also believed there was a certain critical complexity above which a more centralized, a priori approach was required. I believed that the most important software (operating systems and really large tools like the Emacs programming editor) needed to be built like cathedrals, carefully crafted by individual wizards or small bands of mages working in splendid isolation, with no beta to be released before its time.\n' +
    '\n' +
    'preach 布道，讲道(尤指教堂中礼拜时); 宣传，宣扬，宣讲(教义、生活方式、体制等); 说教;\n' +
    '\n' +
    'gospel 福音(《圣经》中关于耶稣生平和教诲的四福音书之一); 福音(耶稣的事迹和教诲); (个人的) 信念，信仰;\n' +
    '\n' +
    'evolutionary 进化的; 演变的; 逐渐发展的;\n' +
    '\n' +
    'priori 【计】【拉】先验（的），同a priori;\n' +
    '\n' +
    'mage 魔术师，博学者;\n' +
    '\n' +
    '多年来，我一直宣扬小工具、快速建模、渐进式编程的Unix福音。我也曾坚信，任何极为复杂的项目之上都是以一个更为中心化和事先规划好的策划为基础的。我相信，绝大多数重要的软件（操作系统，以及各种极大型的工具，比如像Emacs这样的编辑器）都需要像教堂一样去修建它。那些极客们都会默默地去编写这些软件，乃至在这些卓越软件辉煌的时刻来临之前，我们甚至不曾看到一个Beta版本。然而，Linux颠覆了我对开源项目开发的种种看法。\n' +
    '\n' +
    'Linus Torvalds\'s style of development—release early and often, delegate everything you can, be open to the point of promiscuity—came as a surprise. No quiet, reverent cathedral-building here—rather, the Linux community seemed to resemble a great babbling bazaar of differing agendas and approaches (aptly symbolized by the Linux archive sites, who\'d take submissions from anyone) out of which a coherent and stable system could seemingly emerge only by a succession of miracles.\n' +
    '\n' +
    'delegate 授(权); 把(工作、权力等)委托(给下级); 选派(某人做某事);\n' +
    '\n' +
    'promiscuity 乱交; 混杂; 混乱; 滥交; 性乱交;\n' +
    '\n' +
    'reverent 非常尊敬的; 深表崇敬的;\n' +
    '\n' +
    'babbling 含混不清地说; 嘀里嘟噜地说; (水流过石块) 潺潺作响;\n' +
    '\n' +
    'aptly 适宜地；适当地;\n' +
    '\n' +
    'coherent 合乎逻辑的; 有条理的; 清楚易懂的; 有表达能力的; 能把自己的意思说清楚的;\n' +
    '\n' +
    'Linus Torvalds的编程风格与此完全不同。他选择尽早发布，快速发布。只要你有能力，他愿意将任何事情都交给你。这一切一切都开放到难以想象。他从来都不会安静地、虔诚地修建这座教堂。相反，Linus带领的Linux社区更像一个嘈杂的集市，里面充满了各种议程和建议（Linux archive网址就是一个典型案例，这里包罗了几乎任何人的项目）。在这种乱象之下，想要诞生除一个可靠的操作系统看起来就是一个奇迹。\n' +
    '\n' +
    'The fact that this bazaar style seemed to work, and work well, came as a distinct shock. As I learned my way around, I worked hard not just at individual projects, but also at trying to understand why the Linux world not only didn\'t fly apart in confusion but seemed to go from strength to strength at a speed barely imaginable to cathedral-builders.\n' +
    '\n' +
    '事实却是集市风格的编程方式出人意料地有用，甚至极为奏效。我正在寻找我自己的开源之道。我不仅活跃于各大独立项目中，还极力去理解为什么Linux社区不会在混乱中分崩离析，反而像我认为的教堂建造者那样以不可思议的能力与速度开发着Linux。\n' +
    '\n' +
    'By mid-1996 I thought I was beginning to understand. Chance handed me a perfect way to test my theory, in the form of an open-source project that I could consciously try to run in the bazaar style. So I did—and it was a significant success.\n' +
    '\n' +
    '1996年中期以前，我觉得我开始渐渐明白了。我把握了一个实践我的理论的绝佳机会。我可以有意地努力地以集市风格去运营一个开源项目。我做了，结果非常成功。\n' +
    '\n' +
    'This is the story of that project. I\'ll use it to propose some aphorisms about effective open-source development. Not all of these are things I first learned in the Linux world, but we\'ll see how the Linux world gives them particular point. If I\'m correct, they\'ll help you understand exactly what it is that makes the Linux community such a fountain of good software—and, perhaps, they will help you become more productive yourself.\n' +
    '\n' +
    'aphorism 格言; 警句;\n' +
    '\n' +
    '接下来，我所讲述的就是这个项目的故事。我会用这个项目提出种种在开源领域中卓有成效的建议。这些建议不只来源于Linux项目，但我们将会看到它们会在Linux中被践行。如果我说的没错，那么这些建议将会启迪您理解为什么Linux会成为一个优秀的软件，也会帮助你更有效地从事你的开源事业。\n' +
    '\n' +
    '#### The Mail Must Get Through\n' +
    '\n' +
    '#### 邮件必须要发出去\n' +
    '\n' +
    'Since 1993 I\'d been running the technical side of a small free-access Internet service provider called Chester County InterLink (CCIL) in West Chester, Pennsylvania. I co-founded CCIL and wrote our unique multiuser bulletin-board software—you can check it out by telnetting to [locke.ccil.org](telnet://locke.ccil.org). Today it supports almost three thousand users on thirty lines. The job allowed me 24-hour-a-day access to the net through CCIL\'s 56K line—in fact, the job practically demanded it!\n' +
    '\n' +
    'bulletin-board A **bulletin board** (**pinboard**, **pin board**, **noticeboard**, or **notice board** in British English) is a surface intended for the posting of public messages\n' +
    '\n' +
    '1993年来，我一直在West Chester, Pennsylvania的一个免费提供网络服务的公司CCIL里提供基础支持。我参与了CCIL的创建，并为此编写了一个多用户论坛软件——你现在还可以用telnet访问[它](telnet://locke.ccil.org)。今天它已经支持了30条网线上大概三千多名用户的网上冲浪。人们可以在CCIL高达56K网速的网络服务中24小时高强度上网——这也是CCIL所想要做的。\n' +
    '\n' +
    'I had gotten quite used to instant Internet email. I found having to periodically telnet over to locke to check my mail annoying. What I wanted was for my mail to be delivered on snark (my home system) so that I would be notified when it arrived and could handle it using all my local tools.\n' +
    '\n' +
    '我已经是如此依赖便捷的邮件服务了。我发现，我总是要周期性地用telnet去登录然后检查我的邮件是不是来了。这太让人恼火了。所以我现在想要把我的邮件自动拉取到我的snark系统上，这个举措将使我能在本地软件中适时地浏览这些邮件。\n' +
    '\n' +
    'The Internet\'s native mail forwarding protocol, SMTP (Simple Mail Transfer Protocol), wouldn\'t suit, because it works best when machines are connected full-time, while my personal machine isn\'t always on the Internet, and doesn\'t have a static IP address. What I needed was a program that would reach out over my intermittent dialup connection and pull across my mail to be delivered locally. I knew such things existed, and that most of them used a simple application protocol called POP (Post Office Protocol). POP is now widely supported by most common mail clients, but at the time, it wasn\'t built in to the mail reader I was using.\n' +
    '\n' +
    'intermittent 断断续续的; 间歇的;\n' +
    '\n' +
    '网络原生的邮件投递协议SMTP看起来并不合适，因为它需要机器总是在线，而事实我的个人电脑不可能总是守在互联网上，更重要的是它没有静态IP地址。我需要的是一个能够在本地断断续续建立连接去拉去我的邮件的软件。我当然知道已经有轮子了，并且这些轮子使用的大多是一个简单的应用协议，叫做POP。POP现在被各大公共邮箱客户端大量应用。但那时，我的邮件阅读器并不支持POP。\n' +
    '\n' +
    'I needed a POP3 client. So I went out on the Internet and found one. Actually, I found three or four. I used one of them for a while, but it was missing what seemed an obvious feature, the ability to hack the addresses on fetched mail so replies would work properly.\n' +
    '\n' +
    '所以我现在需要一个POP3客户端。所以我在网上不断寻找，并找到了一个。实际上，我还找到了三个四个甚至更多。我一一尝试，却没有一个达到了我想要的效果——一边拉取邮件，一边从邮件信息中提取对方的邮件地址，使得我的一切回信不会发到错误的地址上。\n' +
    '\n' +
    'The problem was this: suppose someone named \'joe\' on locke sent me mail. If I fetched the mail to snark and then tried to reply to it, my mailer would cheerfully try to ship it to a nonexistent \'joe\' on snark. Hand-editing reply addresses to tack on \'<@ccil.org>\'quickly got to be a serious pain.\n' +
    '\n' +
    '现在的问题是：如果一个名叫joe的人在locke上给我发了一封邮件。如果我将它拉取到了我的snark上并尝试回复，我的邮件软件就会欢欣雀跃地把这个回复发给我snark上的一个不存在的地址`joe`。我总是不得不手动给`joe`添加一个`@ccil.org`后缀。真让人头大。\n' +
    '\n' +
    'This was clearly something the computer ought to be doing for me. But none of the existing POP clients knew how! And this brings us to the first lesson:\n' +
    '\n' +
    '显然，电脑应该帮我做这件事情。但没有哪怕一个POP客户端贴心地做到了这一点！这给我上了一课。\n' +
    '\n' +
    '1. Every good work of software starts by scratching a developer\'s personal itch.\n' +
    '\n' +
    'scratch one\'s itch 给某人瘙痒\n' +
    '\n' +
    '1. 每一个软件都源于网上的各种轮子让开发者心中作痒。\n' +
    '\n' +
    'Perhaps this should have been obvious (it\'s long been proverbial that \'\'Necessity is the mother of invention\'\') but too often software developers spend their days grinding away for pay at programs they neither need nor love. But not in the Linux world—which may explain why the average quality of software originated in the Linux community is so high.\n' +
    '\n' +
    'proverbial 谚语的; 谚语表达的; 如谚语所说的; 众所周知; 著名;\n' +
    '\n' +
    '可能这个教训非常浅显（正如谚语所说：需求是发明之母）。但太多太多的软件开发者还在不断地将他们宝贵的日子花费在那些他们既不需要也不热爱的软件项目上了。但Linux社区并非如此——这也解释了为什么Linux社区软件的平均质量都如此之高。\n' +
    '\n' +
    'So, did I immediately launch into a furious whirl of coding up a brand-new POP3 client to compete with the existing ones? Not on your life! I looked carefully at the POP utilities I had in hand, asking myself \'\'Which one is closest to what I want?\'\' Because:\n' +
    '\n' +
    '狂怒的; 暴怒的; 激烈的; 猛烈的; 高速的; 盛怒的;\n' +
    '\n' +
    '(使) 旋转，回旋，打转; (头脑、思想等) 混乱不清，激动，恍惚;\n' +
    '\n' +
    '所以，这是不是意味着我就要马上就会狂热地投入到了创造一个全新的POP3客户端上的编程上，然后迫不及待地把我编写完的程序与其他POP3客户端去较量一番？我想你也不会！取而代之的是，我会想办法不断检查我手上所有的POP客户端，然后扪心自问："哪一个理我的终点最近？"因为：\n' +
    '\n' +
    '2. Good programmers know what to write. Great ones know what to rewrite (and reuse).\n' +
    '3. 一个好的程序员知道怎么写，而一个更好的程序员知道怎么复用。\n' +
    '\n' +
    'While I don\'t claim to be a great programmer, I try to imitate one. An important trait of the great ones is constructive laziness. They know that you get an A not for effort but for results, and that it\'s almost always easier to start from a good partial solution than from nothing at all.\n' +
    '\n' +
    '我不是说我是一个更好的程序员，我想说的是我尽力做得更好。一个更好的程序员的显著特点是他们会有建设性地偷懒。大家只在意你是否拿到了一个A（国外成绩分A, B, C...多个等级）而不在意你是否努力。所以从一个几乎正确的答案开始要比从白手起家几乎总是更为容易的。\n' +
    '\n' +
    '[Linus Torvalds](http://www.tuxedo.org/~esr/faqs/linus), for example, didn\'t actually try to write Linux from scratch. Instead, he started by reusing code and ideas from Minix, a tiny Unix-like operating system for PC clones. Eventually all the Minix code went away or was completely rewritten—but while it was there, it provided scaffolding for the infant that would eventually become Linux.\n' +
    '\n' +
    'scaffolding 脚手架(组); 鹰架;\n' +
    '\n' +
    '我举个例子，[Linus Torvalds](http://www.tuxedo.org/~esr/faqs/linus)其实也没有从零开始写Linux。相反，它直接复用了Minix——一个面向PC的类Unix操作系统——并从中汲取灵感。最终那些Minix的代码都被迭代干净了，虽然它们曾经就在那里。它们为Linux的诞生提供了脚手架。\n' +
    '\n' +
    'In the same spirit, I went looking for an existing POP utility that was reasonably well coded, to use as a development base.\n' +
    '\n' +
    '所以，有样学样，我也将为我即将有效开发的POP客户端寻找一个稳定的基石。\n' +
    '\n' +
    'The source-sharing tradition of the Unix world has always been friendly to code reuse (this is why the GNU project chose Unix as a base OS, in spite of serious reservations about the OS itself). The Linux world has taken this tradition nearly to its technological limit; it has terabytes of open sources generally available. So spending time looking for some else\'s almost-good-enough is more likely to give you good results in the Linux world than anywhere else.\n' +
    '\n' +
    'have reservations about 对...持有保留意见\n' +
    '\n' +
    'Unix的开源分享传统从来就是为代码复用而生的（这也就是为什么尽管GNU对Unix抱有成见，他们还是首先选择了Unix作为操作系统平台）作为后来人，Linux延续了这一传统并将之推至登峰造极；基于Linux系统我们有以TB计的开源项目可以利用。所以花点时间寻找一个几乎已经很不错的POP客户端在Linux社区中大概是最容易做到的。\n' +
    '\n' +
    'And it did for me. With those I\'d found earlier, my second search made up a total of nine candidates—fetchpop, PopTart, get-mail, gwpop, pimp, pop-perl, popc, popmail and upop. The one I first settled on was \'fetchpop\' by Seung-Hong Oh. I put my header-rewrite feature in it, and made various other improvements which the author accepted into his 1.9 release.\n' +
    '\n' +
    '我确实做到了。在之前我找到的那些客户端中，我第二次搜查就找到了9个候选的抄袭对象——fetchpop, PopTart, get-mail, gwpop, pimp, pop-perl, popc, popmail和upop。我首先采用的是Seung-Hong Oh编写的fetchpop，并对其做了大量的改进。后来Oh在fetchpop的1.9版本中吸收了这些改进。\n' +
    '\n' +
    'A few weeks later, though, I stumbled across the code for popclient by Carl Harris, and found I had a problem. Though fetchpop had some good original ideas in it (such as its background-daemon mode), it could only handle POP3 and was rather amateurishly coded (Seung-Hong was at that time a bright but inexperienced programmer, and both traits showed). Carl\'s code was better, quite professional and solid, but his program lacked several important and rather tricky-to-implement fetchpop features (including those I\'d coded myself).\n' +
    '\n' +
    'stumble across 意外发现; 偶然看见;\n' +
    '\n' +
    'amateurishly 业余的; 不熟练的;\n' +
    '\n' +
    '几个星期后，我意外发现了Carl Harris的代码，并发现了我现在存在的一个问题。虽然fetchpop有他独有的一些比较好的创意（比如后台守护模式），但是它只能处理POP3并且写得很烂（Oh是个很聪明的程序员，但显然他的经验还不够）。Carl的代码更合我口味，它十分pro且solid，却少了几个我在fetchpop发现的不错的特性（包括我自己写的那些）。\n' +
    '\n' +
    'Stay or switch? If I switched, I\'d be throwing away the coding I\'d already done in exchange for a better development base.\n' +
    '\n' +
    '继续编写fetchpop还是转向popclient？为了更好的基石我将不得不放弃我以前写的那些代码。\n' +
    '\n' +
    'A practical motive to switch was the presence of multiple-protocol support. POP3 is the most commonly used of the post-office server protocols, but not the only one. Fetchpop and the other competition didn\'t do POP2, RPOP, or APOP, and I was already having vague thoughts of perhaps adding [IMAP](http://www.imap.org/) (Internet Message Access Protocol, the most recently designed and most powerful post-office protocol) just for fun.\n' +
    '\n' +
    'presence 在场; 出席; 存在; 出现; (派遣的) 一个队; (尤指执行任务的) 部队;\n' +
    '\n' +
    '我最心动的还是popclient支持多协议。虽然POP3是邮件服务器最广泛采用的协议，但它并非唯一。fetchpop和其他的一些软件并不支持POP2、RPOP和APOP。我还隐隐地想要再加一个IMAP协议，也就图一乐。\n' +
    '\n' +
    'But I had a more theoretical reason to think switching might be as good an idea as well, something I learned long before Linux.\n' +
    '\n' +
    '但现在根据我曾经从Linux学到的那些经验，我现在有了转向popclient是一个好想法的理论基础。\n' +
    '\n' +
    '3. \'\'Plan to throw one away; you will, anyhow.\'\' (Fred Brooks, *The Mythical Man-Month*, Chapter 11)\n' +
    '\n' +
    '3. "那些想要放弃的计划，你最终无论如何都会放弃。"(Fred Brooks, *The Mythical Man-Month*, Chapter 11)\n' +
    '\n' +
    'Or, to put it another way, you often don\'t really understand the problem until after the first time you implement a solution. The second time, maybe you know enough to do it right. So if you want to get it right, be ready to start over *at least* once [[JB\\]](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s14.html#JB).\n' +
    '\n' +
    '或者，换一句话说，在你动手做之前你往往不是真的理解一个问题。第二次，可能你会更清楚怎么样做是对的。所以如果你想要做一个正确的事情，要做好做至少一次的准备。\n' +
    '\n' +
    'Well (I told myself) the changes to fetchpop had been my first try. So I switched.\n' +
    '\n' +
    '好吧（我告诉自己），我在fetchpop上做的种种尝试仅仅是我的第一次尝试。就这样我转向了popclient。\n' +
    '\n' +
    'After I sent my first set of popclient patches to Carl Harris on 25 June 1996, I found out that he had basically lost interest in popclient some time before. The code was a bit dusty, with minor bugs hanging out. I had many changes to make, and we quickly agreed that the logical thing for me to do was take over the program.\n' +
    '\n' +
    '后来我在1996年6月25日第一次发requests给Carl Harris，我发现他邮件差不多失去了维护popclient的兴趣了。现在这份代码看起来有一点吃灰，还有一些小bug驱之不去。我有很多要修改的地方，那么将popclient交给我看起来就是理所当然的了。\n' +
    '\n' +
    'Without my actually noticing, the project had escalated. No longer was I just contemplating minor patches to an existing POP client. I took on maintaining an entire one, and there were ideas bubbling in my head that I knew would probably lead to major changes.\n' +
    '\n' +
    '不知不觉，这个项目焕然一新。很快我不再尝试对popclient做这样那样的小小改动。我开始关注每一个地方，并且一个又一个想法不断涌上心头——这些想法将会给popclient带来巨大的变化。\n' +
    '\n' +
    'In a software culture that encourages code-sharing, this is a natural way for a project to evolve. I was acting out this principle:\n' +
    '\n' +
    '在开源分享文化中，迭代项目的一个自然的方式，我将用下面这个准则给出：\n' +
    '\n' +
    '4. If you have the right attitude, interesting problems will find you.\n' +
    '\n' +
    '4. 如果你态度够好，有趣的问题自然会来找你的。\n' +
    '\n' +
    'But Carl Harris\'s attitude was even more important. He understood that\n' +
    '\n' +
    '但Carl Harris的态度更为重要。他也明白：\n' +
    '\n' +
    '5. When you lose interest in a program, your last duty to it is to hand it off to a competent successor.\n' +
    '\n' +
    'competent 足以胜任的; 有能力的; 称职的; 合格的; 不错的; 尚好的; 有决定权的;\n' +
    '\n' +
    '当你失去维护一个软件的兴趣的时候，你最后的责任就是将他交给一个有能力的后来者。\n' +
    '\n' +
    'Without ever having to discuss it, Carl and I knew we had a common goal of having the best solution out there. The only question for either of us was whether I could establish that I was a safe pair of hands. Once I did that, he acted with grace and dispatch. I hope I will do as well when it comes my turn.\n' +
    '\n' +
    'Carl和我不约而同地认为我们都要做出一个最好的程序。现在摆在我们面前的唯一问题是我是否有能力。只要我确实能行，他将欣然归去。我希望我确是这样吧。无论如何，现在是我的回合了。\n' +
    '\n' +
    '#### The Importance of Having Users\n' +
    '\n' +
    '#### 拥有用户的重要性\n' +
    '\n' +
    'And so I inherited popclient. Just as importantly, I inherited popclient\'s user base. Users are wonderful things to have, and not just because they demonstrate that you\'re serving a need, that you\'ve done something right. Properly cultivated, they can become co-developers.\n' +
    '\n' +
    '就这样，我继承了popclient的代码。并且同样重要的是，我还继承了popclient的用户基础。拥有用户是这个世界上最美妙的事情之一，这不仅仅是他们证明了你确实在做一个有意义的并且是对的事情。如果加以培养，他们将会变成你的合作者。\n' +
    '\n' +
    'Another strength of the Unix tradition, one that Linux pushes to a happy extreme, is that a lot of users are hackers too. Because source code is available, they can be *effective* hackers. This can be tremendously useful for shortening debugging time. Given a bit of encouragement, your users will diagnose problems, suggest fixes, and help improve the code far more quickly than you could unaided.\n' +
    '\n' +
    'tremendously 特别; 巨大; 非常地; 极地;\n' +
    '\n' +
    'Unix开源分享传统的另一个重要力量是，不仅Linux每天非常开心地push，还有一大批用户和极客也在做同样的事情。因为开源代码可以被分享，他们最终都成为了*有效*的极客。他们将会为缩短debug时间带来极大利好。你的永辉将会发现问题，提交修改，最终将会很快让你的代码比你一个人快得多的速度改进你的代码。\n' +
    '\n' +
    '6. Treating your users as co-developers is your least-hassle route to rapid code improvement and effective debugging.\n' +
    '\n' +
    'hassle 困难; 麻烦; 分歧; 争论; 烦恼;\n' +
    '\n' +
    '6. 把你的用户也视作协作者就是敏捷开发和有效解决问题的终南捷径。\n' +
    '\n' +
    'The power of this effect is easy to underestimate. In fact, pretty well all of us in the open-source world drastically underestimated how well it would scale up with number of users and against system complexity, until Linus Torvalds showed us differently.\n' +
    '\n' +
    'drastically 彻底地；激烈地;\n' +
    '\n' +
    '这种效应的力量很容易被低估。事实上，在Linus Torvalds告诉我们之前，我们开源界所有的人都明显低估了这种随着用户的增加而可以更显著地对抗系统复杂性的力量。\n' +
    '\n' +
    'In fact, I think Linus\'s cleverest and most consequential hack was not the construction of the Linux kernel itself, but rather his invention of the Linux development model. When I expressed this opinion in his presence once, he smiled and quietly repeated something he has often said: \'\'I\'m basically a very lazy person who likes to get credit for things other people actually do.\'\' Lazy like a fox. Or, as Robert Heinlein famously wrote of one of his characters, too lazy to fail.\n' +
    '\n' +
    '事实上，我认为Linus的聪明之处，也是他最杰出的贡献，并不是编写Linux内核本身，而是发明了Linuxk开发模式。当我向他表达了这一看法的时候，他微笑且安静地重复了他常提的那句话：”我实际上是一个非常懒的人，但却常常因为其他人的勤奋工作而获得赞扬。“他懒得就像一只狐狸，就像Robert Heinlein所刻画的一个经典的形象那样，最终他甚至懒得失败了。\n' +
    '\n' +
    'In retrospect, one precedent for the methods and success of Linux can be seen in the development of the GNU Emacs Lisp library and Lisp code archives. In contrast to the cathedral-building style of the Emacs C core and most other GNU tools, the evolution of the Lisp code pool was fluid and very user-driven. Ideas and prototype modes were often rewritten three or four times before reaching a stable final form. And loosely-coupled collaborations enabled by the Internet, *a la* Linux, were frequent.\n' +
    '\n' +
    'precedent 可援用参考的具体例子; 实例; 范例; 先前出现的事例; 前例; 先例; 传统; 常例; 常规;\n' +
    '\n' +
    'fluid 流畅优美的; 易变的; 不稳定的; 流动的; 流体的;\n' +
    '\n' +
    'a la 按照…方式; 仿照;\n' +
    '\n' +
    '现在回想一下，这样的典例在GNU Emacs Lisp库和Lisp系列库的编写中也屡见不鲜。与Emacs C内核和GNU工具链的大教堂模式所截然不同的是，用户驱动的Lisp代码工具是如此流畅而优美地迭代着。在达到稳定的最终版本之前，创意和模型往往会被重写三到四次。宽松的Linux式协同合作在互联网的帮助下毫无障碍。\n' +
    '\n' +
    'Indeed, my own most successful single hack previous to fetchmail was probably Emacs VC (version control) mode, a Linux-like collaboration by email with three other people, only one of whom (Richard Stallman, the author of Emacs and founder of the [Free Software Foundation](http://www.fsf.org/)) I have met to this day. It was a front-end for SCCS, RCS and later CVS from within Emacs that offered \'\'one-touch\'\' version control operations. It evolved from a tiny, crude sccs.el mode somebody else had written. And the development of VC succeeded because, unlike Emacs itself, Emacs Lisp code could go through release/test/improve generations very quickly.\n' +
    '\n' +
    '确实，我之前在fetchmail工作中最成功的地方大概就是Emacs VC模式了，这种模式也通过邮件与其他三个人像Linux那样合作。这三个人中我至今只面基了其中一人（Richard Stallman，Emacs的作者并且也是[Free Software Foundation](http://www.fsf.org/)的创始人）。这是提供给Emcas中SCCS、RCS和后来的CVS”单击完成“版本控制的前端。Emacs VC模式来源于一个不知名的人写的又小又粗糙的sccs.el。最终VC成功的原因不同于Emacs Lisp的成功，它可以在发布/测试/改进的迭代中快速改进。\n' +
    '\n' +
    'The Emacs story is not unique. There have been other software products with a two-level architecture and a two-tier user community that combined a cathedral-mode core and a bazaar-mode toolbox. One such is MATLAB, a commercial data-analysis and visualization tool. Users of MATLAB and other products with a similar structure invariably report that the action, the ferment, the innovation mostly takes place in the open part of the tool where a large and varied community can tinker with it.\n' +
    '\n' +
    'two-tier 两层; 双层; 双重的; 双板块; 两层结构;\n' +
    '\n' +
    'ferment 政治或社会上的) 动乱，骚动，纷扰;\n' +
    '\n' +
    'invariably 始终如一地; 一贯地;\n' +
    '\n' +
    ' tinker with 摆弄; 修补; 胡乱地修补; 瞎摆弄;\n' +
    '\n' +
    'Emacs的故事不是唯一的。其他软件也有这样的两级架构和双层用户社区——内核基于大教堂模式，而工具链基于集市模式。比如matlab，一个商用的数据分析和可视化软件。matlab和其他产品一样也始终贯彻着开放软件的一部分的理念供社区瞎摆弄，从而获取着这些用户所报告的各种行为、错误和建议。\n' +
    '\n' +
    '#### Release Early, Release Often\n' +
    '\n' +
    '#### 尽早发布，频繁发布\n' +
    '\n' +
    'Early and frequent releases are a critical part of the Linux development model. Most developers (including me) used to believe this was bad policy for larger than trivial projects, because early versions are almost by definition buggy versions and you don\'t want to wear out the patience of your users.\n' +
    '\n' +
    '尽早发布，频繁发布是Linux开发模型中极为重要的一部分。大多数开发者（包括我）过去认为这对任何像样的项目都是一个坏的策略，因为早期版本往往明显是有错的，你不可能将你的用户的耐心消磨殆尽。\n' +
    '\n' +
    'This belief reinforced the general commitment to a cathedral-building style of development. If the overriding objective was for users to see as few bugs as possible, why then you\'d only release a version every six months (or less often), and work like a dog on debugging between releases. The Emacs C core was developed this way. The Lisp library, in effect, was not—because there were active Lisp archives outside the FSF\'s control, where you could go to find new and development code versions independently of Emacs\'s release cycle [[QR\\]](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s14.html#QR).\n' +
    '\n' +
    'overriding 最重要的; 首要的; 凌驾一切的;\n' +
    '\n' +
    'objective 目标; 目的; (望远镜或显微镜的) 物镜;\n' +
    '\n' +
    'in effect 其实; 实际上;\n' +
    '\n' +
    '这个信念也使得一般的项目都倾向于一种大教堂式的开发。如果维护一个项目的首要目标是让用户看到尽可能少的bug，那么为什么不每6个月（或更频繁）都发布一个版本，然后在一次又一次的版本迭代中忙于修复bug呢。Emacs C内核就是这么开发的。Lisp库实际上却不是——因为在FSF的控制之外还有其他不同的版本。这些不同的版本各自都提供不同的代码版本并且独立于Emacs的发布周期。\n' +
    '\n' +
    'The most important of these, the Ohio State Emacs Lisp archive, anticipated the spirit and many of the features of today\'s big Linux archives. But few of us really thought very hard about what we were doing, or about what the very existence of that archive suggested about problems in the FSF\'s cathedral-building development model. I made one serious attempt around 1992 to get a lot of the Ohio code formally merged into the official Emacs Lisp library. I ran into political trouble and was largely unsuccessful.\n' +
    '\n' +
    '其中最重要的一个版本是Ohio州的Emacs Lisp代码库，遵循着如今天Linux代码的精神。?但几乎没有人真正去想过我们在做什么，或者在FSF大教堂式的开发模式中是否存在种种问题。我在1992年曾竭尽全力将Ohio版本的代码合并到到官方Emacs Lisp库中。后来我遇到了政治性的麻烦并最终很不成功。\n' +
    '\n' +
    'But by a year later, as Linux became widely visible, it was clear that something different and much healthier was going on there. Linus\'s open development policy was the very opposite of cathedral-building. Linux\'s Internet archives were burgeoning, multiple distributions were being floated. And all of this was driven by an unheard-of frequency of core system releases.\n' +
    '\n' +
    'burgeoning 激增; 迅速发展;\n' +
    '\n' +
    'unheard-of 前所未闻的; 空前的; 很反常的;\n' +
    '\n' +
    '但一年以后，当Linux开始出名的时候，我觉得Linux的核心中有着某种不知名的不同之处和与Emacs Lisp库所不同的健康之处。Linus的开放开发模式已经与大教堂模式完全对立了。Linux的网络版本快速迭代这，大量不同的发行版相继浮现。并且他们都以空前的频率被主发布版本驱动着。\n' +
    '\n' +
    'Linus was treating his users as co-developers in the most effective possible way:\n' +
    '\n' +
    'Linus将他的用户视为协助开发者将成为开源开发的利剑：\n' +
    '\n' +
    '7. Release early. Release often. And listen to your customers.\n' +
    '\n' +
    '7. 尽早发布，频繁发布。并且倾听你用户的一切反馈。\n' +
    '\n' +
    'Linus\'s innovation wasn\'t so much in doing quick-turnaround releases incorporating lots of user feedback (something like this had been Unix-world tradition for a long time), but in scaling it up to a level of intensity that matched the complexity of what he was developing. In those early times (around 1991) it wasn\'t unknown for him to release a new kernel more than once a *day!*Because he cultivated his base of co-developers and leveraged the Internet for collaboration harder than anyone else, this worked.\n' +
    '\n' +
    'quick-turnaround ？\n' +
    '\n' +
    'leverage 举债经营; 借贷收购;\n' +
    '\n' +
    'Linus的创新并不在于对用户反馈快速且大量的发布新的版本（这似乎已是Unix社区的老传统了），他的创新指出在于他将这个技巧提升到了与他正开发的软件所相匹配的等级。在早期（大约是1991年），他一天至少发布一次的频率几乎无人不知！他培养了协同合作者并比其他任何人都更巧妙地借用着网络合作。这的确很有作用。\n' +
    '\n' +
    'But *how* did it work? And was it something I could duplicate, or did it rely on some unique genius of Linus Torvalds?\n' +
    '\n' +
    '但这究竟是**怎样**起作用的？这是我能够效仿的，还是仅仅依赖于Linus Torvalds身上与众不同之处？\n' +
    '\n' +
    'I didn\'t think so. Granted, Linus is a damn fine hacker. How many of us could engineer an entire production-quality operating system kernel from scratch? But Linux didn\'t represent any awesome conceptual leap forward. Linus is not (or at least, not yet) an innovative genius of design in the way that, say, Richard Stallman or James Gosling (of NeWS and Java) are. Rather, Linus seems to me to be a genius of engineering and implementation, with a sixth sense for avoiding bugs and development dead-ends and a true knack for finding the minimum-effort path from point A to point B. Indeed, the whole design of Linux breathes this quality and mirrors Linus\'s essentially conservative and simplifying design approach.\n' +
    '\n' +
    'knack (天生的或学会的) 技能，本领; 习惯; 癖好;\n' +
    '\n' +
    '我并不认同后者。我非常赞同Linus就是一个牛逼上天的极客。我们软件工程师中究竟能有几人能够从头牵动一整个工业级操作系统内核的开发？但Linux从来就没有显现出任何超前的飞跃。Linus不是（至少现在还不是）像Richard Stallman或James Gosling那样具有真正卓有创新的设计天赋的人。相比于此，Linus更像是一个真正的工程领域天才，他有着避免各种bug和死路的第六感和在两点之间画出最短线段的天赋神通。确实，整个Linux都贯彻着Linus特有的极致到底的保守和简约设计。\n' +
    '\n' +
    'So, if rapid releases and leveraging the Internet medium to the hilt were not accidents but integral parts of Linus\'s engineering-genius insight into the minimum-effort path, what was he maximizing? What was he cranking out of the machinery?\n' +
    '\n' +
    'to the hilt 最大限度地; 完全地; 彻底地;\n' +
    '\n' +
    'integral 必需的; 不可或缺的; 作为组成部分的; 完整的; 完备的;\n' +
    '\n' +
    ' crank out of: \n' +
    '\n' +
    'machinery (统称) 机器; (尤指) 大型机器; 机器的运转部分; 机械装置; 组织; 机构; 系统; 体制;\n' +
    '\n' +
    '所以，如果如果快速发布和淋漓尽致地借用网络媒介并非偶然而是具有独到眼光的Linus设计天赋有机的一部分，那其中他最强大的一部分是什么？他超越现有体制的是什么？\n' +
    '\n' +
    'Put that way, the question answers itself. Linus was keeping his hacker/users constantly stimulated and rewarded—stimulated by the prospect of having an ego-satisfying piece of the action, rewarded by the sight of constant (even *daily*) improvement in their work.\n' +
    '\n' +
    'Linus was directly aiming to maximize the number of person-hours thrown at debugging and development, even at the possible cost of instability in the code and user-base burnout if any serious bug proved intractable. Linus was behaving as though he believed something like this:\n' +
    '\n' +
    '8. Given a large enough beta-tester and co-developer base, almost every problem will be characterized quickly and the fix obvious to someone.\n' +
    '\n' +
    '8. 只要我发布足够多的beta版本和拥有协同开发者基础，几乎任何问题都会马上被定位并定然会被某些人处理掉\n' +
    '\n' +
    'Or, less formally, \'\'Given enough eyeballs, all bugs are shallow.\'\' I dub this: \'\'Linus\'s Law\'\'.\n' +
    '\n' +
    '或者不正式地说：”只要多几双眼睛，所有bug都无所遁形。“我将之戏称为："Linus法则"\n' +
    '\n' +
    'My original formulation was that every problem \'\'will be transparent to somebody\'\'. Linus demurred that the person who understands and fixes the problem is not necessarily or even usually the person who first characterizes it. \'\'Somebody finds the problem,\'\' he says, \'\'and somebody *else* understands it. And I\'ll go on record as saying that finding it is the bigger challenge.\'\' That correction is important; we\'ll see how in the next section, when we examine the practice of debugging in more detail. But the key point is that both parts of the process (finding and fixing) tend to happen rapidly.\n' +
    '\n' +
    'demur 表示反对; 提出异议; 拒绝;\n' +
    '\n' +
    '我最初的表述是一切问题“都自然会被某个人弄清楚”。Linus反对道明白问题的人和解决问题的人不一定是同一个甚至也不是第一个发现它的人。"一些人发现了问题，"他说，“另一些人明白了问题。并且我还作证到发现一个问题往往比理解它要更为困难。”这个纠正非常重要；当我们在下一章中寻求实践debug的更多细节的时候，会看到我为什么（怎么？）这样说。还有一个关键是，无论是发现问题还是解决问题往往都会很快完成。\n' +
    '\n' +
    'In Linus\'s Law, I think, lies the core difference underlying the cathedral-builder and bazaar styles. In the cathedral-builder view of programming, bugs and development problems are tricky, insidious, deep phenomena. It takes months of scrutiny by a dedicated few to develop confidence that you\'ve winkled them all out. Thus the long release intervals, and the inevitable disappointment when long-awaited releases are not perfect.\n' +
    '\n' +
    'In the bazaar view, on the other hand, you assume that bugs are generally shallow phenomena—or, at least, that they turn shallow pretty quickly when exposed to a thousand eager co-developers pounding on every single new release. Accordingly you release often in order to get more corrections, and as a beneficial side effect you have less to lose if an occasional botch gets out the door.\n' +
    '\n' +
    'And that\'s it. That\'s enough. If \'\'Linus\'s Law\'\' is false, then any system as complex as the Linux kernel, being hacked over by as many hands as the that kernel was, should at some point have collapsed under the weight of unforseen bad interactions and undiscovered \'\'deep\'\' bugs. If it\'s true, on the other hand, it is sufficient to explain Linux\'s relative lack of bugginess and its continuous uptimes spanning months or even years.\n' +
    '\n' +
    'Maybe it shouldn\'t have been such a surprise, at that. Sociologists years ago discovered that the averaged opinion of a mass of equally expert (or equally ignorant) observers is quite a bit more reliable a predictor than the opinion of a single randomly-chosen one of the observers. They called this the *Delphi effect*. It appears that what Linus has shown is that this applies even to debugging an operating system—that the Delphi effect can tame development complexity even at the complexity level of an OS kernel. [[CV\\]](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s14.html#CV)\n' +
    '\n' +
    'One special feature of the Linux situation that clearly helps along the Delphi effect is the fact that the contributors for any given project are self-selected. An early respondent pointed out that contributions are received not from a random sample, but from people who are interested enough to use the software, learn about how it works, attempt to find solutions to problems they encounter, and actually produce an apparently reasonable fix. Anyone who passes all these filters is highly likely to have something useful to contribute.\n' +
    '\n' +
    'Linus\'s Law can be rephrased as \'\'Debugging is parallelizable\'\'. Although debugging requires debuggers to communicate with some coordinating developer, it doesn\'t require significant coordination between debuggers. Thus it doesn\'t fall prey to the same quadratic complexity and management costs that make adding developers problematic.\n' +
    '\n' +
    'In practice, the theoretical loss of efficiency due to duplication of work by debuggers almost never seems to be an issue in the Linux world. One effect of a \'\'release early and often\'\' policy is to minimize such duplication by propagating fed-back fixes quickly[[JH\\]](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s14.html#JH).\n' +
    '\n' +
    'Brooks (the author of *The Mythical Man-Month*) even made an off-hand observation related to this: \'\'The total cost of maintaining a widely used program is typically 40 percent or more of the cost of developing it. Surprisingly this cost is strongly affected by the number of users. *More users find more bugs*.\'\' [emphasis added].\n' +
    '\n' +
    'More users find more bugs because adding more users adds more different ways of stressing the program. This effect is amplified when the users are co-developers. Each one approaches the task of bug characterization with a slightly different perceptual set and analytical toolkit, a different angle on the problem. The \'\'Delphi effect\'\' seems to work precisely because of this variation. In the specific context of debugging, the variation also tends to reduce duplication of effort.\n' +
    '\n' +
    'So adding more beta-testers may not reduce the complexity of the current \'\'deepest\'\' bug from the *developer\'s* point of view, but it increases the probability that someone\'s toolkit will be matched to the problem in such a way that the bug is shallow *to that person*.\n' +
    '\n' +
    'Linus coppers his bets, too. In case there *are* serious bugs, Linux kernel version are numbered in such a way that potential users can make a choice either to run the last version designated \'\'stable\'\' or to ride the cutting edge and risk bugs in order to get new features. This tactic is not yet systematically imitated by most Linux hackers, but perhaps it should be; the fact that either choice is available makes both more attractive. [[HBS\\]](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s14.html#HBS)\n' +
    '\n' +
    '#### How Many Eyeballs Tame Complexity\n' +
    '\n' +
    'Tame 驯化; 驯服; 使易于控制;\n' +
    '\n' +
    '#### 多少双眼睛才能驯服复杂度\n' +
    '\n' +
    'It\'s one thing to observe in the large that the bazaar style greatly accelerates debugging and code evolution. It\'s another to understand exactly how and why it does so at the micro-level of day-to-day developer and tester behavior. In this section (written three years after the original paper, using insights by developers who read it and re-examined their own behavior) we\'ll take a hard look at the actual mechanisms. Non-technically inclined readers can safely skip to the next section.\n' +
    '\n' +
    'One key to understanding is to realize exactly why it is that the kind of bug report non–source-aware users normally turn in tends not to be very useful. Non–source-aware users tend to report only surface symptoms; they take their environment for granted, so they (a) omit critical background data, and (b) seldom include a reliable recipe for reproducing the bug.\n' +
    '\n' +
    '理解集市风格关键的一点是为什么不关心源码的用户所提交的报告往往是没有很大用处的。那些不关心源码的用户往往倾向于报告表面症状。他们把拥有一个理想的环境看作是理所当然，所以他们\n' +
    '\n' +
    '+ 往往会忽略一些比较重要的背景数据\n' +
    '+ 几乎不会提供一个复现bug的可靠方法。\n' +
    '\n' +
    'The underlying problem here is a mismatch between the tester\'s and the developer\'s mental models of the program; the tester, on the outside looking in, and the developer on the inside looking out. In closed-source development they\'re both stuck in these roles, and tend to talk past each other and find each other deeply frustrating.\n' +
    '\n' +
    '深层次的问题是测试者和开发者面对问题的模型是不匹配的。测试者从外向内看，而开发者从内向外看。在闭源开发中，他们都困于他们各自的角色，并各说各的，最终让对方都大失所望。\n' +
    '\n' +
    'Open-source development breaks this bind, making it far easier for tester and developer to develop a shared representation grounded in the actual source code and to communicate effectively about it. Practically, there is a huge difference in leverage for the developer between the kind of bug report that just reports externally-visible symptoms and the kind that hooks directly to the developer\'s source-code–based mental representation of the program.\n' +
    '\n' +
    '开源开发则打破了这一限制，当基于同一份代码时他们可以以一个共享的模型去更好地交流。在实践中，仅仅报告表面特征的bug报告和直接基于源代码共享模型的bug报告对开发者起到的帮助是截然不同的。\n' +
    '\n' +
    'Most bugs, most of the time, are easily nailed given even an incomplete but suggestive characterization of their error conditions at source-code level. When someone among your beta-testers can point out, "there\'s a boundary problem in line nnn", or even just "under conditions X, Y, and Z, this variable rolls over", a quick look at the offending code often suffices to pin down the exact mode of failure and generate a fix.\n' +
    '\n' +
    'Thus, source-code awareness by both parties greatly enhances both good communication and the synergy between what a beta-tester reports and what the core developer(s) know. In turn, this means that the core developers\' time tends to be well conserved, even with many collaborators.\n' +
    '\n' +
    'Another characteristic of the open-source method that conserves developer time is the communication structure of typical open-source projects. Above I used the term "core developer"; this reflects a distinction between the project core (typically quite small; a single core developer is common, and one to three is typical) and the project halo of beta-testers and available contributors (which often numbers in the hundreds).\n' +
    '\n' +
    'The fundamental problem that traditional software-development organization addresses is Brook\'s Law: \'\'Adding more programmers to a late project makes it later.\'\' More generally, Brooks\'s Law predicts that the complexity and communication costs of a project rise with the square of the number of developers, while work done only rises linearly.\n' +
    '\n' +
    'Brooks\'s Law is founded on experience that bugs tend strongly to cluster at the interfaces between code written by different people, and that communications/coordination overhead on a project tends to rise with the number of interfaces between human beings. Thus, problems scale with the number of communications paths between developers, which scales as the square of the humber of developers (more precisely, according to the formula N*(N - 1)/2 where N is the number of developers).\n' +
    '\n' +
    'The Brooks\'s Law analysis (and the resulting fear of large numbers in development groups) rests on a hidden assummption: that the communications structure of the project is necessarily a complete graph, that everybody talks to everybody else. But on open-source projects, the halo developers work on what are in effect separable parallel subtasks and interact with each other very little; code changes and bug reports stream through the core group, and only *within* that small core group do we pay the full Brooksian overhead. [[SU\\]](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s14.html#SU)\n' +
    '\n' +
    'There are are still more reasons that source-code–level bug reporting tends to be very efficient. They center around the fact that a single error can often have multiple possible symptoms, manifesting differently depending on details of the user\'s usage pattern and environment. Such errors tend to be exactly the sort of complex and subtle bugs (such as dynamic-memory-management errors or nondeterministic interrupt-window artifacts) that are hardest to reproduce at will or to pin down by static analysis, and which do the most to create long-term problems in software.\n' +
    '\n' +
    'A tester who sends in a tentative source-code–level characterization of such a multi-symptom bug (e.g. "It looks to me like there\'s a window in the signal handling near line 1250" or "Where are you zeroing that buffer?") may give a developer, otherwise too close to the code to see it, the critical clue to a half-dozen disparate symptoms. In cases like this, it may be hard or even impossible to know which externally-visible misbehaviour was caused by precisely which bug—but with frequent releases, it\'s unnecessary to know. Other collaborators will be likely to find out quickly whether their bug has been fixed or not. In many cases, source-level bug reports will cause misbehaviours to drop out without ever having been attributed to any specific fix.\n' +
    '\n' +
    'Complex multi-symptom errors also tend to have multiple trace paths from surface symptoms back to the actual bug. Which of the trace paths a given developer or tester can chase may depend on subtleties of that person\'s environment, and may well change in a not obviously deterministic way over time. In effect, each developer and tester samples a semi-random set of the program\'s state space when looking for the etiology of a symptom. The more subtle and complex the bug, the less likely that skill will be able to guarantee the relevance of that sample.\n' +
    '\n' +
    'For simple and easily reproducible bugs, then, the accent will be on the "semi" rather than the "random"; debugging skill and intimacy with the code and its architecture will matter a lot. But for complex bugs, the accent will be on the "random". Under these circumstances many people running traces will be much more effective than a few people running traces sequentially—even if the few have a much higher average skill level.\n' +
    '\n' +
    'This effect will be greatly amplified if the difficulty of following trace paths from different surface symptoms back to a bug varies significantly in a way that can\'t be predicted by looking at the symptoms. A single developer sampling those paths sequentially will be as likely to pick a difficult trace path on the first try as an easy one. On the other hand, suppose many people are trying trace paths in parallel while doing rapid releases. Then it is likely one of them will find the easiest path immediately, and nail the bug in a much shorter time. The project maintainer will see that, ship a new release, and the other people running traces on the same bug will be able to stop before having spent too much time on their more difficult traces [[RJ\\]](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s14.html#RJ).\n' +
    '\n' +
    '#### When Is a Rose Not a Rose?\n' +
    '\n' +
    'Having studied Linus\'s behavior and formed a theory about why it was successful, I made a conscious decision to test this theory on my new (admittedly much less complex and ambitious) project.\n' +
    '\n' +
    'But the first thing I did was reorganize and simplify popclient a lot. Carl Harris\'s implementation was very sound, but exhibited a kind of unnecessary complexity common to many C programmers. He treated the code as central and the data structures as support for the code. As a result, the code was beautiful but the data structure design ad-hoc and rather ugly (at least by the high standards of this veteran LISP hacker).\n' +
    '\n' +
    'I had another purpose for rewriting besides improving the code and the data structure design, however. That was to evolve it into something I understood completely. It\'s no fun to be responsible for fixing bugs in a program you don\'t understand.\n' +
    '\n' +
    'For the first month or so, then, I was simply following out the implications of Carl\'s basic design. The first serious change I made was to add IMAP support. I did this by reorganizing the protocol machines into a generic driver and three method tables (for POP2, POP3, and IMAP). This and the previous changes illustrate a general principle that\'s good for programmers to keep in mind, especially in languages like C that don\'t naturally do dynamic typing:\n' +
    '\n' +
    '9. Smart data structures and dumb code works a lot better than the other way around.\n' +
    '\n' +
    '9. 聪明的数据结构和糟糕的代码要比聪明的代码和糟糕的数据结构要好得多。\n' +
    '\n' +
    'Brooks, Chapter 9: \'\'Show me your flowchart and conceal your tables, and I shall continue to be mystified. Show me your tables, and I won\'t usually need your flowchart; it\'ll be obvious.\'\' Allowing for thirty years of terminological/cultural shift, it\'s the same point.\n' +
    '\n' +
    'At this point (early September 1996, about six weeks from zero) I started thinking that a name change might be in order—after all, it wasn\'t just a POP client any more. But I hesitated, because there was as yet nothing genuinely new in the design. My version of popclient had yet to develop an identity of its own.\n' +
    '\n' +
    'That changed, radically, when popclient learned how to forward fetched mail to the SMTP port. I\'ll get to that in a moment. But first: I said earlier that I\'d decided to use this project to test my theory about what Linus Torvalds had done right. How (you may well ask) did I do that? In these ways:\n' +
    '\n' +
    '- I released early and often (almost never less often than every ten days; during periods of intense development, once a day).\n' +
    '- I grew my beta list by adding to it everyone who contacted me about fetchmail.\n' +
    '- I sent chatty announcements to the beta list whenever I released, encouraging people to participate.\n' +
    '- And I listened to my beta-testers, polling them about design decisions and stroking them whenever they sent in patches and feedback.\n' +
    '\n' +
    'The payoff from these simple measures was immediate. From the beginning of the project, I got bug reports of a quality most developers would kill for, often with good fixes attached. I got thoughtful criticism, I got fan mail, I got intelligent feature suggestions. Which leads to:\n' +
    '\n' +
    '10. If you treat your beta-testers as if they\'re your most valuable resource, they will respond by becoming your most valuable resource.\n' +
    '\n' +
    'One interesting measure of fetchmail\'s success is the sheer size of the project beta list, fetchmail-friends. At the time of latest revision of this paper (November 2000) it has 287 members and is adding two or three a week.\n' +
    '\n' +
    'Actually, when I revised in late May 1997 I found the list was beginning to lose members from its high of close to 300 for an interesting reason. Several people have asked me to unsubscribe them because fetchmail is working so well for them that they no longer need to see the list traffic! Perhaps this is part of the normal life-cycle of a mature bazaar-style project.\n' +
    '\n' +
    '#### Popclient becomes Fetchmail\n' +
    '\n' +
    'The real turning point in the project was when Harry Hochheiser sent me his scratch code for forwarding mail to the client machine\'s SMTP port. I realized almost immediately that a reliable implementation of this feature would make all the other mail delivery modes next to obsolete.\n' +
    '\n' +
    'For many weeks I had been tweaking fetchmail rather incrementally while feeling like the interface design was serviceable but grubby—inelegant and with too many exiguous options hanging out all over. The options to dump fetched mail to a mailbox file or standard output particularly bothered me, but I couldn\'t figure out why.\n' +
    '\n' +
    '(If you don\'t care about the technicalia of Internet mail, the next two paragraphs can be safely skipped.)\n' +
    '\n' +
    'What I saw when I thought about SMTP forwarding was that popclient had been trying to do too many things. It had been designed to be both a mail transport agent (MTA) and a local delivery agent (MDA). With SMTP forwarding, it could get out of the MDA business and be a pure MTA, handing off mail to other programs for local delivery just as sendmail does.\n' +
    '\n' +
    'Why mess with all the complexity of configuring a mail delivery agent or setting up lock-and-append on a mailbox when port 25 is almost guaranteed to be there on any platform with TCP/IP support in the first place? Especially when this means retrieved mail is guaranteed to look like normal sender-initiated SMTP mail, which is really what we want anyway.\n' +
    '\n' +
    '(Back to a higher level....)\n' +
    '\n' +
    'Even if you didn\'t follow the preceding technical jargon, there are several important lessons here. First, this SMTP-forwarding concept was the biggest single payoff I got from consciously trying to emulate Linus\'s methods. A user gave me this terrific idea—all I had to do was understand the implications.\n' +
    '\n' +
    '11. The next best thing to having good ideas is recognizing good ideas from your users. Sometimes the latter is better.\n' +
    '\n' +
    'Interestingly enough, you will quickly find that if you are completely and self-deprecatingly truthful about how much you owe other people, the world at large will treat you as though you did every bit of the invention yourself and are just being becomingly modest about your innate genius. We can all see how well this worked for Linus!\n' +
    '\n' +
    '(When I gave my talk at the first Perl Conference in August 1997, hacker extraordinaire Larry Wall was in the front row. As I got to the last line above he called out, religious-revival style, \'\'Tell it, tell it, brother!\'\'. The whole audience laughed, because they knew this had worked for the inventor of Perl, too.)\n' +
    '\n' +
    'After a very few weeks of running the project in the same spirit, I began to get similar praise not just from my users but from other people to whom the word leaked out. I stashed away some of that email; I\'ll look at it again sometime if I ever start wondering whether my life has been worthwhile :-).\n' +
    '\n' +
    'But there are two more fundamental, non-political lessons here that are general to all kinds of design.\n' +
    '\n' +
    '12. Often, the most striking and innovative solutions come from realizing that your concept of the problem was wrong.\n' +
    '\n' +
    'I had been trying to solve the wrong problem by continuing to develop popclient as a combined MTA/MDA with all kinds of funky local delivery modes. Fetchmail\'s design needed to be rethought from the ground up as a pure MTA, a part of the normal SMTP-speaking Internet mail path.\n' +
    '\n' +
    'When you hit a wall in development—when you find yourself hard put to think past the next patch—it\'s often time to ask not whether you\'ve got the right answer, but whether you\'re asking the right question. Perhaps the problem needs to be reframed.\n' +
    '\n' +
    'Well, I had reframed my problem. Clearly, the right thing to do was (1) hack SMTP forwarding support into the generic driver, (2) make it the default mode, and (3) eventually throw out all the other delivery modes, especially the deliver-to-file and deliver-to-standard-output options.\n' +
    '\n' +
    'I hesitated over step 3 for some time, fearing to upset long-time popclient users dependent on the alternate delivery mechanisms. In theory, they could immediately switch to \'.forward\' files or their non-sendmail equivalents to get the same effects. In practice the transition might have been messy.\n' +
    '\n' +
    'But when I did it, the benefits proved huge. The cruftiest parts of the driver code vanished. Configuration got radically simpler—no more grovelling around for the system MDA and user\'s mailbox, no more worries about whether the underlying OS supports file locking.\n' +
    '\n' +
    'Also, the only way to lose mail vanished. If you specified delivery to a file and the disk got full, your mail got lost. This can\'t happen with SMTP forwarding because your SMTP listener won\'t return OK unless the message can be delivered or at least spooled for later delivery.\n' +
    '\n' +
    'Also, performance improved (though not so you\'d notice it in a single run). Another not insignificant benefit of this change was that the manual page got a lot simpler.\n' +
    '\n' +
    'Later, I had to bring delivery via a user-specified local MDA back in order to allow handling of some obscure situations involving dynamic SLIP. But I found a much simpler way to do it.\n' +
    '\n' +
    'The moral? Don\'t hesitate to throw away superannuated features when you can do it without loss of effectiveness. Antoine de Saint-Exupéry (who was an aviator and aircraft designer when he wasn\'t authoring classic children\'s books) said:\n' +
    '\n' +
    '13. \'\'Perfection (in design) is achieved not when there is nothing more to add, but rather when there is nothing more to take away.\'\'\n' +
    '\n' +
    'When your code is getting both better and simpler, that is when you *know* it\'s right. And in the process, the fetchmail design acquired an identity of its own, different from the ancestral popclient.\n' +
    '\n' +
    'It was time for the name change. The new design looked much more like a dual of sendmail than the old popclient had; both are MTAs, but where sendmail pushes then delivers, the new popclient pulls then delivers. So, two months off the blocks, I renamed it fetchmail.\n' +
    '\n' +
    'There is a more general lesson in this story about how SMTP delivery came to fetchmail. It is not only debugging that is parallelizable; development and (to a perhaps surprising extent) exploration of design space is, too. When your development mode is rapidly iterative, development and enhancement may become special cases of debugging—fixing \'bugs of omission\' in the original capabilities or concept of the software.\n' +
    '\n' +
    'Even at a higher level of design, it can be very valuable to have lots of co-developers random-walking through the design space near your product. Consider the way a puddle of water finds a drain, or better yet how ants find food: exploration essentially by diffusion, followed by exploitation mediated by a scalable communication mechanism. This works very well; as with Harry Hochheiser and me, one of your outriders may well find a huge win nearby that you were just a little too close-focused to see.\n' +
    '\n' +
    '#### Fetchmail Grows Up\n' +
    '\n' +
    'There I was with a neat and innovative design, code that I knew worked well because I used it every day, and a burgeoning beta list. It gradually dawned on me that I was no longer engaged in a trivial personal hack that might happen to be useful to few other people. I had my hands on a program that every hacker with a Unix box and a SLIP/PPP mail connection really needs.\n' +
    '\n' +
    'With the SMTP forwarding feature, it pulled far enough in front of the competition to potentially become a \'\'category killer\'\', one of those classic programs that fills its niche so competently that the alternatives are not just discarded but almost forgotten.\n' +
    '\n' +
    'I think you can\'t really aim or plan for a result like this. You have to get pulled into it by design ideas so powerful that afterward the results just seem inevitable, natural, even foreordained. The only way to try for ideas like that is by having lots of ideas—or by having the engineering judgment to take other peoples\' good ideas beyond where the originators thought they could go.\n' +
    '\n' +
    'Andy Tanenbaum had the original idea to build a simple native Unix for IBM PCs, for use as a teaching tool (he called it Minix). Linus Torvalds pushed the Minix concept further than Andrew probably thought it could go—and it grew into something wonderful. In the same way (though on a smaller scale), I took some ideas by Carl Harris and Harry Hochheiser and pushed them hard. Neither of us was \'original\' in the romantic way people think is genius. But then, most science and engineering and software development isn\'t done by original genius, hacker mythology to the contrary.\n' +
    '\n' +
    'The results were pretty heady stuff all the same—in fact, just the kind of success every hacker lives for! And they meant I would have to set my standards even higher. To make fetchmail as good as I now saw it could be, I\'d have to write not just for my own needs, but also include and support features necessary to others but outside my orbit. And do that while keeping the program simple and robust.\n' +
    '\n' +
    'The first and overwhelmingly most important feature I wrote after realizing this was multidrop support—the ability to fetch mail from mailboxes that had accumulated all mail for a group of users, and then route each piece of mail to its individual recipients.\n' +
    '\n' +
    'I decided to add the multidrop support partly because some users were clamoring for it, but mostly because I thought it would shake bugs out of the single-drop code by forcing me to deal with addressing in full generality. And so it proved. Getting [RFC 822](http://info.internet.isi.edu/in-notes/rfc/files/rfc822.txt)address parsing right took me a remarkably long time, not because any individual piece of it is hard but because it involved a pile of interdependent and fussy details.\n' +
    '\n' +
    'But multidrop addressing turned out to be an excellent design decision as well. Here\'s how I knew:\n' +
    '\n' +
    '14. Any tool should be useful in the expected way, but a truly great tool lends itself to uses you never expected.\n' +
    '\n' +
    'The unexpected use for multidrop fetchmail is to run mailing lists with the list kept, and alias expansion done, on the *client* side of the Internet connection. This means someone running a personal machine through an ISP account can manage a mailing list without continuing access to the ISP\'s alias files.\n' +
    '\n' +
    'Another important change demanded by my beta-testers was support for 8-bit MIME (Multipurpose Internet Mail Extensions) operation. This was pretty easy to do, because I had been careful to keep the code 8-bit clean (that is, to not press the 8th bit, unused in the ASCII character set, into service to carry information within the program). Not because I anticipated the demand for this feature, but rather in obedience to another rule:\n' +
    '\n' +
    '15. When writing gateway software of any kind, take pains to disturb the data stream as little as possible—and *never*throw away information unless the recipient forces you to!\n' +
    '\n' +
    'Had I not obeyed this rule, 8-bit MIME support would have been difficult and buggy. As it was, all I had to do is read the MIME standard ([RFC 1652](http://info.internet.isi.edu/in-notes/rfc/files/rfc1652.txt)) and add a trivial bit of header-generation logic.\n' +
    '\n' +
    'Some European users bugged me into adding an option to limit the number of messages retrieved per session (so they can control costs from their expensive phone networks). I resisted this for a long time, and I\'m still not entirely happy about it. But if you\'re writing for the world, you have to listen to your customers—this doesn\'t change just because they\'re not paying you in money.\n' +
    '\n' +
    '#### A Few More Lessons from Fetchmail\n' +
    '\n' +
    'Before we go back to general software-engineering issues, there are a couple more specific lessons from the fetchmail experience to ponder. Nontechnical readers can safely skip this section.\n' +
    '\n' +
    'The rc (control) file syntax includes optional \'noise\' keywords that are entirely ignored by the parser. The English-like syntax they allow is considerably more readable than the traditional terse keyword-value pairs you get when you strip them all out.\n' +
    '\n' +
    'These started out as a late-night experiment when I noticed how much the rc file declarations were beginning to resemble an imperative minilanguage. (This is also why I changed the original popclient \'\'server\'\' keyword to \'\'poll\'\').\n' +
    '\n' +
    'It seemed to me that trying to make that imperative minilanguage more like English might make it easier to use. Now, although I\'m a convinced partisan of the \'\'make it a language\'\' school of design as exemplified by Emacs and HTML and many database engines, I am not normally a big fan of \'\'English-like\'\' syntaxes.\n' +
    '\n' +
    'Traditionally programmers have tended to favor control syntaxes that are very precise and compact and have no redundancy at all. This is a cultural legacy from when computing resources were expensive, so parsing stages had to be as cheap and simple as possible. English, with about 50% redundancy, looked like a very inappropriate model then.\n' +
    '\n' +
    'This is not my reason for normally avoiding English-like syntaxes; I mention it here only to demolish it. With cheap cycles and core, terseness should not be an end in itself. Nowadays it\'s more important for a language to be convenient for humans than to be cheap for the computer.\n' +
    '\n' +
    'There remain, however, good reasons to be wary. One is the complexity cost of the parsing stage—you don\'t want to raise that to the point where it\'s a significant source of bugs and user confusion in itself. Another is that trying to make a language syntax English-like often demands that the \'\'English\'\' it speaks be bent seriously out of shape, so much so that the superficial resemblance to natural language is as confusing as a traditional syntax would have been. (You see this bad effect in a lot of so-called \'\'fourth generation\'\' and commercial database-query languages.)\n' +
    '\n' +
    'The fetchmail control syntax seems to avoid these problems because the language domain is extremely restricted. It\'s nowhere near a general-purpose language; the things it says simply are not very complicated, so there\'s little potential for confusion in moving mentally between a tiny subset of English and the actual control language. I think there may be a broader lesson here:\n' +
    '\n' +
    '16. When your language is nowhere near Turing-complete, syntactic sugar can be your friend.\n' +
    '\n' +
    'Another lesson is about security by obscurity. Some fetchmail users asked me to change the software to store passwords encrypted in the rc file, so snoopers wouldn\'t be able to casually see them.\n' +
    '\n' +
    'I didn\'t do it, because this doesn\'t actually add protection. Anyone who\'s acquired permissions to read your rc file will be able to run fetchmail as you anyway—and if it\'s your password they\'re after, they\'d be able to rip the necessary decoder out of the fetchmail code itself to get it.\n' +
    '\n' +
    'All \'.fetchmailrc\' password encryption would have done is give a false sense of security to people who don\'t think very hard. The general rule here is:\n' +
    '\n' +
    '17. A security system is only as secure as its secret. Beware of pseudo-secrets.\n' +
    '\n' +
    '#### Necessary Preconditions for the Bazaar Style\n' +
    '\n' +
    'Early reviewers and test audiences for this essay consistently raised questions about the preconditions for successful bazaar-style development, including both the qualifications of the project leader and the state of code at the time one goes public and starts to try to build a co-developer community.\n' +
    '\n' +
    'It\'s fairly clear that one cannot code from the ground up in bazaar style [[IN\\]](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s14.html#IN). One can test, debug and improve in bazaar style, but it would be very hard to *originate* a project in bazaar mode. Linus didn\'t try it. I didn\'t either. Your nascent developer community needs to have something runnable and testable to play with.\n' +
    '\n' +
    'When you start community-building, what you need to be able to present is a *plausible promise*. Your program doesn\'t have to work particularly well. It can be crude, buggy, incomplete, and poorly documented. What it must not fail to do is (a) run, and (b) convince potential co-developers that it can be evolved into something really neat in the foreseeable future.\n' +
    '\n' +
    'Linux and fetchmail both went public with strong, attractive basic designs. Many people thinking about the bazaar model as I have presented it have correctly considered this critical, then jumped from that to the conclusion that a high degree of design intuition and cleverness in the project leader is indispensable.\n' +
    '\n' +
    'But Linus got his design from Unix. I got mine initially from the ancestral popclient (though it would later change a great deal, much more proportionately speaking than has Linux). So does the leader/coordinator for a bazaar-style effort really have to have exceptional design talent, or can he get by through leveraging the design talent of others?\n' +
    '\n' +
    'I think it is not critical that the coordinator be able to originate designs of exceptional brilliance, but it is absolutely critical that the coordinator be able to *recognize good design ideas from others*.\n' +
    '\n' +
    'Both the Linux and fetchmail projects show evidence of this. Linus, while not (as previously discussed) a spectacularly original designer, has displayed a powerful knack for recognizing good design and integrating it into the Linux kernel. And I have already described how the single most powerful design idea in fetchmail (SMTP forwarding) came from somebody else.\n' +
    '\n' +
    'Early audiences of this essay complimented me by suggesting that I am prone to undervalue design originality in bazaar projects because I have a lot of it myself, and therefore take it for granted. There may be some truth to this; design (as opposed to coding or debugging) is certainly my strongest skill.\n' +
    '\n' +
    'But the problem with being clever and original in software design is that it gets to be a habit—you start reflexively making things cute and complicated when you should be keeping them robust and simple. I have had projects crash on me because I made this mistake, but I managed to avoid this with fetchmail.\n' +
    '\n' +
    'So I believe the fetchmail project succeeded partly because I restrained my tendency to be clever; this argues (at least) against design originality being essential for successful bazaar projects. And consider Linux. Suppose Linus Torvalds had been trying to pull off fundamental innovations in operating system design during the development; does it seem at all likely that the resulting kernel would be as stable and successful as what we have?\n' +
    '\n' +
    'A certain base level of design and coding skill is required, of course, but I expect almost anybody seriously thinking of launching a bazaar effort will already be above that minimum. The open-source community\'s internal market in reputation exerts subtle pressure on people not to launch development efforts they\'re not competent to follow through on. So far this seems to have worked pretty well.\n' +
    '\n' +
    'There is another kind of skill not normally associated with software development which I think is as important as design cleverness to bazaar projects—and it may be more important. A bazaar project coordinator or leader must have good people and communications skills.\n' +
    '\n' +
    'This should be obvious. In order to build a development community, you need to attract people, interest them in what you\'re doing, and keep them happy about the amount of work they\'re doing. Technical sizzle will go a long way towards accomplishing this, but it\'s far from the whole story. The personality you project matters, too.\n' +
    '\n' +
    'It is not a coincidence that Linus is a nice guy who makes people like him and want to help him. It\'s not a coincidence that I\'m an energetic extrovert who enjoys working a crowd and has some of the delivery and instincts of a stand-up comic. To make the bazaar model work, it helps enormously if you have at least a little skill at charming people.\n' +
    '\n' +
    '#### The Social Context of Open-Source Software\n' +
    '\n' +
    'It is truly written: the best hacks start out as personal solutions to the author\'s everyday problems, and spread because the problem turns out to be typical for a large class of users. This takes us back to the matter of rule 1, restated in a perhaps more useful way:\n' +
    '\n' +
    '> \\18. To solve an interesting problem, start by finding a problem that is interesting to you.\n' +
    '\n' +
    'So it was with Carl Harris and the ancestral popclient, and so with me and fetchmail. But this has been understood for a long time. The interesting point, the point that the histories of Linux and fetchmail seem to demand we focus on, is the next stage—the evolution of software in the presence of a large and active community of users and co-developers.\n' +
    '\n' +
    'In *The Mythical Man-Month*, Fred Brooks observed that programmer time is not fungible; adding developers to a late software project makes it later. As we\'ve seen previously, he argued that the complexity and communication costs of a project rise with the square of the number of developers, while work done only rises linearly. Brooks\'s Law has been widely regarded as a truism. But we\'ve examined in this essay an number of ways in which the process of open-source development falsifies the assumptionms behind it—and, empirically, if Brooks\'s Law were the whole picture Linux would be impossible.\n' +
    '\n' +
    'Gerald Weinberg\'s classic *The Psychology of Computer Programming* supplied what, in hindsight, we can see as a vital correction to Brooks. In his discussion of \'\'egoless programming\'\', Weinberg observed that in shops where developers are not territorial about their code, and encourage other people to look for bugs and potential improvements in it, improvement happens dramatically faster than elsewhere. (Recently, Kent Beck\'s \'extreme programming\' technique of deploying coders in pairs looking over one anothers\' shoulders might be seen as an attempt to force this effect.)\n' +
    '\n' +
    'Weinberg\'s choice of terminology has perhaps prevented his analysis from gaining the acceptance it deserved—one has to smile at the thought of describing Internet hackers as \'\'egoless\'\'. But I think his argument looks more compelling today than ever.\n' +
    '\n' +
    'The bazaar method, by harnessing the full power of the \'\'egoless programming\'\' effect, strongly mitigates the effect of Brooks\'s Law. The principle behind Brooks\'s Law is not repealed, but given a large developer population and cheap communications its effects can be swamped by competing nonlinearities that are not otherwise visible. This resembles the relationship between Newtonian and Einsteinian physics—the older system is still valid at low energies, but if you push mass and velocity high enough you get surprises like nuclear explosions or Linux.\n' +
    '\n' +
    'The history of Unix should have prepared us for what we\'re learning from Linux (and what I\'ve verified experimentally on a smaller scale by deliberately copying Linus\'s methods [[EGCS\\]](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s14.html#EGCS)). That is, while coding remains an essentially solitary activity, the really great hacks come from harnessing the attention and brainpower of entire communities. The developer who uses only his or her own brain in a closed project is going to fall behind the developer who knows how to create an open, evolutionary context in which feedback exploring the design space, code contributions, bug-spotting, and other improvements come from from hundreds (perhaps thousands) of people.\n' +
    '\n' +
    'But the traditional Unix world was prevented from pushing this approach to the ultimate by several factors. One was the legal contraints of various licenses, trade secrets, and commercial interests. Another (in hindsight) was that the Internet wasn\'t yet good enough.\n' +
    '\n' +
    'Before cheap Internet, there were some geographically compact communities where the culture encouraged Weinberg\'s \'\'egoless\'\' programming, and a developer could easily attract a lot of skilled kibitzers and co-developers. Bell Labs, the MIT AI and LCS labs, UC Berkeley—these became the home of innovations that are legendary and still potent.\n' +
    '\n' +
    'Linux was the first project for which a conscious and successful effort to use the entire *world* as its talent pool was made. I don\'t think it\'s a coincidence that the gestation period of Linux coincided with the birth of the World Wide Web, and that Linux left its infancy during the same period in 1993–1994 that saw the takeoff of the ISP industry and the explosion of mainstream interest in the Internet. Linus was the first person who learned how to play by the new rules that pervasive Internet access made possible.\n' +
    '\n' +
    'While cheap Internet was a necessary condition for the Linux model to evolve, I think it was not by itself a sufficient condition. Another vital factor was the development of a leadership style and set of cooperative customs that could allow developers to attract co-developers and get maximum leverage out of the medium.\n' +
    '\n' +
    'But what is this leadership style and what are these customs? They cannot be based on power relationships—and even if they could be, leadership by coercion would not produce the results we see. Weinberg quotes the autobiography of the 19th-century Russian anarchist Pyotr Alexeyvich Kropotkin\'s *Memoirs of a Revolutionist* to good effect on this subject:\n' +
    '\n' +
    '> Having been brought up in a serf-owner\'s family, I entered active life, like all young men of my time, with a great deal of confidence in the necessity of commanding, ordering, scolding, punishing and the like. But when, at an early stage, I had to manage serious enterprises and to deal with [free] men, and when each mistake would lead at once to heavy consequences, I began to appreciate the difference between acting on the principle of command and discipline and acting on the principle of common understanding. The former works admirably in a military parade, but it is worth nothing where real life is concerned, and the aim can be achieved only through the severe effort of many converging wills.\n' +
    '\n' +
    'The \'\'severe effort of many converging wills\'\' is precisely what a project like Linux requires—and the \'\'principle of command\'\' is effectively impossible to apply among volunteers in the anarchist\'s paradise we call the Internet. To operate and compete effectively, hackers who want to lead collaborative projects have to learn how to recruit and energize effective communities of interest in the mode vaguely suggested by Kropotkin\'s \'\'principle of understanding\'\'. They must learn to use Linus\'s Law.[[SP\\]](http://www.catb.org/~esr/writings/cathedral-bazaar/cathedral-bazaar/ar01s14.html#SP)\n' +
    '\n' +
    'Earlier I referred to the \'\'Delphi effect\'\' as a possible explanation for Linus\'s Law. But more powerful analogies to adaptive systems in biology and economics also irresistably suggest themselves. The Linux world behaves in many respects like a free market or an ecology, a collection of selfish agents attempting to maximize utility which in the process produces a self-correcting spontaneous order more elaborate and efficient than any amount of central planning could have achieved. Here, then, is the place to seek the \'\'principle of understanding\'\'.\n' +
    '\n' +
    'The \'\'utility function\'\' Linux hackers are maximizing is not classically economic, but is the intangible of their own ego satisfaction and reputation among other hackers. (One may call their motivation \'\'altruistic\'\', but this ignores the fact that altruism is itself a form of ego satisfaction for the altruist). Voluntary cultures that work this way are not actually uncommon; one other in which I have long participated is science fiction fandom, which unlike hackerdom has long explicitly recognized \'\'egoboo\'\' (ego-boosting, or the enhancement of one\'s reputation among other fans) as the basic drive behind volunteer activity.\n' +
    '\n' +
    'Linus, by successfully positioning himself as the gatekeeper of a project in which the development is mostly done by others, and nurturing interest in the project until it became self-sustaining, has shown an acute grasp of Kropotkin\'s \'\'principle of shared understanding\'\'. This quasi-economic view of the Linux world enables us to see how that understanding is applied.\n' +
    '\n' +
    'We may view Linus\'s method as a way to create an efficient market in \'\'egoboo\'\'—to connect the selfishness of individual hackers as firmly as possible to difficult ends that can only be achieved by sustained cooperation. With the fetchmail project I have shown (albeit on a smaller scale) that his methods can be duplicated with good results. Perhaps I have even done it a bit more consciously and systematically than he.\n' +
    '\n' +
    'Many people (especially those who politically distrust free markets) would expect a culture of self-directed egoists to be fragmented, territorial, wasteful, secretive, and hostile. But this expectation is clearly falsified by (to give just one example) the stunning variety, quality, and depth of Linux documentation. It is a hallowed given that programmers *hate* documenting; how is it, then, that Linux hackers generate so much documentation? Evidently Linux\'s free market in egoboo works better to produce virtuous, other-directed behavior than the massively-funded documentation shops of commercial software producers.\n' +
    '\n' +
    'Both the fetchmail and Linux kernel projects show that by properly rewarding the egos of many other hackers, a strong developer/coordinator can use the Internet to capture the benefits of having lots of co-developers without having a project collapse into a chaotic mess. So to Brooks\'s Law I counter-propose the following:\n' +
    '\n' +
    '> 19: Provided the development coordinator has a communications medium at least as good as the Internet, and knows how to lead without coercion, many heads are inevitably better than one.\n' +
    '\n' +
    'I think the future of open-source software will increasingly belong to people who know how to play Linus\'s game, people who leave behind the cathedral and embrace the bazaar. This is not to say that individual vision and brilliance will no longer matter; rather, I think that the cutting edge of open-source software will belong to people who start from individual vision and brilliance, then amplify it through the effective construction of voluntary communities of interest.\n' +
    '\n' +
    'Perhaps this is not only the future of *open-source* software. No closed-source developer can match the pool of talent the Linux community can bring to bear on a problem. Very few could afford even to hire the more than 200 (1999: 600, 2000: 800) people who have contributed to fetchmail!\n' +
    '\n' +
    'Perhaps in the end the open-source culture will triumph not because cooperation is morally right or software \'\'hoarding\'\' is morally wrong (assuming you believe the latter, which neither Linus nor I do), but simply because the closed-source world cannot win an evolutionary arms race with open-source communities that can put orders of magnitude more skilled time into a problem.\n' +
    '\n' +
    '#### On Management and the Maginot Line\n' +
    '\n' +
    'The original *Cathedral and Bazaar* paper of 1997 ended with the vision above—that of happy networked hordes of programmer/anarchists outcompeting and overwhelming the hierarchical world of conventional closed software.\n' +
    '\n' +
    'A good many skeptics weren\'t convinced, however; and the questions they raise deserve a fair engagement. Most of the objections to the bazaar argument come down to the claim that its proponents have underestimated the productivity-multiplying effect of conventional management.\n' +
    '\n' +
    'Traditionally-minded software-development managers often object that the casualness with which project groups form and change and dissolve in the open-source world negates a significant part of the apparent advantage of numbers that the open-source community has over any single closed-source developer. They would observe that in software development it is really sustained effort over time and the degree to which customers can expect continuing investment in the product that matters, not just how many people have thrown a bone in the pot and left it to simmer.\n' +
    '\n' +
    'There is something to this argument, to be sure; in fact, I have developed the idea that expected future service value is the key to the economics of software production in the essay [*The Magic Cauldron*](http://www.tuxedo.org/~esr/writings/magic-cauldron/).\n' +
    '\n' +
    'But this argument also has a major hidden problem; its implicit assumption that open-source development cannot deliver such sustained effort. In fact, there have been open-source projects that maintained a coherent direction and an effective maintainer community over quite long periods of time without the kinds of incentive structures or institutional controls that conventional management finds essential. The development of the GNU Emacs editor is an extreme and instructive example; it has absorbed the efforts of hundreds of contributors over 15 years into a unified architectural vision, despite high turnover and the fact that only one person (its author) has been continuously active during all that time. No closed-source editor has ever matched this longevity record.\n' +
    '\n' +
    'This suggests a reason for questioning the advantages of conventionally-managed software development that is independent of the rest of the arguments over cathedral vs. bazaar mode. If it\'s possible for GNU Emacs to express a consistent architectural vision over 15 years, or for an operating system like Linux to do the same over 8 years of rapidly changing hardware and platform technology; and if (as is indeed the case) there have been many well-architected open-source projects of more than 5 years duration -- then we are entitled to wonder what, if anything, the tremendous overhead of conventionally-managed development is actually buying us.\n' +
    '\n' +
    'Whatever it is certainly doesn\'t include reliable execution by deadline, or on budget, or to all features of the specification; it\'s a rare \'managed\' project that meets even one of these goals, let alone all three. It also does not appear to be ability to adapt to changes in technology and economic context during the project lifetime, either; the open-source community has proven *far* more effective on that score (as one can readily verify, for example, by comparing the 30-year history of the Internet with the short half-lives of proprietary networking technologies—or the cost of the 16-bit to 32-bit transition in Microsoft Windows with the nearly effortless upward migration of Linux during the same period, not only along the Intel line of development but to more than a dozen other hardware platforms, including the 64-bit Alpha as well).\n' +
    '\n' +
    'One thing many people think the traditional mode buys you is somebody to hold legally liable and potentially recover compensation from if the project goes wrong. But this is an illusion; most software licenses are written to disclaim even warranty of merchantability, let alone performance—and cases of successful recovery for software nonperformance are vanishingly rare. Even if they were common, feeling comforted by having somebody to sue would be missing the point. You didn\'t want to be in a lawsuit; you wanted working software.\n' +
    '\n' +
    'So what is all that management overhead buying?\n' +
    '\n' +
    'In order to understand that, we need to understand what software development managers believe they do. A woman I know who seems to be very good at this job says software project management has five functions:\n' +
    '\n' +
    '- To *define goals* and keep everybody pointed in the same direction\n' +
    '- To *monitor* and make sure crucial details don\'t get skipped\n' +
    '- To *motivate* people to do boring but necessary drudgework\n' +
    '- To *organize* the deployment of people for best productivity\n' +
    '- To *marshal resources* needed to sustain the project\n' +
    '\n' +
    'Apparently worthy goals, all of these; but under the open-source model, and in its surrounding social context, they can begin to seem strangely irrelevant. We\'ll take them in reverse order.\n' +
    '\n' +
    'My friend reports that a lot of *resource marshalling* is basically defensive; once you have your people and machines and office space, you have to defend them from peer managers competing for the same resources, and from higher-ups trying to allocate the most efficient use of a limited pool.\n' +
    '\n' +
    'But open-source developers are volunteers, self-selected for both interest and ability to contribute to the projects they work on (and this remains generally true even when they are being paid a salary to hack open source.) The volunteer ethos tends to take care of the \'attack\' side of resource-marshalling automatically; people bring their own resources to the table. And there is little or no need for a manager to \'play defense\' in the conventional sense.\n' +
    '\n' +
    'Anyway, in a world of cheap PCs and fast Internet links, we find pretty consistently that the only really limiting resource is skilled attention. Open-source projects, when they founder, essentially never do so for want of machines or links or office space; they die only when the developers themselves lose interest.\n' +
    '\n' +
    'That being the case, it\'s doubly important that open-source hackers *organize themselves* for maximum productivity by self-selection—and the social milieu selects ruthlessly for competence. My friend, familiar with both the open-source world and large closed projects, believes that open source has been successful partly because its culture only accepts the most talented 5% or so of the programming population. She spends most of her time organizing the deployment of the other 95%, and has thus observed first-hand the well-known variance of a factor of one hundred in productivity between the most able programmers and the merely competent.\n' +
    '\n' +
    'The size of that variance has always raised an awkward question: would individual projects, and the field as a whole, be better off without more than 50% of the least able in it? Thoughtful managers have understood for a long time that if conventional software management\'s only function were to convert the least able from a net loss to a marginal win, the game might not be worth the candle.\n' +
    '\n' +
    'The success of the open-source community sharpens this question considerably, by providing hard evidence that it is often cheaper and more effective to recruit self-selected volunteers from the Internet than it is to manage buildings full of people who would rather be doing something else.\n' +
    '\n' +
    'Which brings us neatly to the question of *motivation*. An equivalent and often-heard way to state my friend\'s point is that traditional development management is a necessary compensation for poorly motivated programmers who would not otherwise turn out good work.\n' +
    '\n' +
    'This answer usually travels with a claim that the open-source community can only be relied on only to do work that is \'sexy\' or technically sweet; anything else will be left undone (or done only poorly) unless it\'s churned out by money-motivated cubicle peons with managers cracking whips over them. I address the psychological and social reasons for being skeptical of this claim in [*Homesteading the Noosphere*](http://www.tuxedo.org/~esr/magic-cauldron/). For present purposes, however, I think it\'s more interesting to point out the implications of accepting it as true.\n' +
    '\n' +
    'If the conventional, closed-source, heavily-managed style of software development is really defended only by a sort of Maginot Line of problems conducive to boredom, then it\'s going to remain viable in each individual application area for only so long as nobody finds those problems really interesting and nobody else finds any way to route around them. Because the moment there is open-source competition for a \'boring\' piece of software, customers are going to know that it was finally tackled by someone who chose that problem to solve because of a fascination with the problem itself—which, in software as in other kinds of creative work, is a far more effective motivator than money alone.\n' +
    '\n' +
    'Having a conventional management structure solely in order to motivate, then, is probably good tactics but bad strategy; a short-term win, but in the longer term a surer loss.\n' +
    '\n' +
    'So far, conventional development management looks like a bad bet now against open source on two points (resource marshalling, organization), and like it\'s living on borrowed time with respect to a third (motivation). And the poor beleaguered conventional manager is not going to get any succour from the *monitoring* issue; the strongest argument the open-source community has is that decentralized peer review trumps all the conventional methods for trying to ensure that details don\'t get slipped.\n' +
    '\n' +
    'Can we save *defining goals* as a justification for the overhead of conventional software project management? Perhaps; but to do so, we\'ll need good reason to believe that management committees and corporate roadmaps are more successful at defining worthy and widely shared goals than the project leaders and tribal elders who fill the analogous role in the open-source world.\n' +
    '\n' +
    'That is on the face of it a pretty hard case to make. And it\'s not so much the open-source side of the balance (the longevity of Emacs, or Linus Torvalds\'s ability to mobilize hordes of developers with talk of \'\'world domination\'\') that makes it tough. Rather, it\'s the demonstrated awfulness of conventional mechanisms for defining the goals of software projects.\n' +
    '\n' +
    'One of the best-known folk theorems of software engineering is that 60% to 75% of conventional software projects either are never completed or are rejected by their intended users. If that range is anywhere near true (and I\'ve never met a manager of any experience who disputes it) then more projects than not are being aimed at goals that are either (a) not realistically attainable, or (b) just plain wrong.\n' +
    '\n' +
    'This, more than any other problem, is the reason that in today\'s software engineering world the very phrase \'\'management committee\'\' is likely to send chills down the hearer\'s spine—even (or perhaps especially) if the hearer is a manager. The days when only programmers griped about this pattern are long past; Dilbert cartoons hang over *executives\'* desks now.\n' +
    '\n' +
    'Our reply, then, to the traditional software development manager, is simple—if the open-source community has really underestimated the value of conventional management, *why do so many of you display contempt for your own process?*\n' +
    '\n' +
    'Once again the example of the open-source community sharpens this question considerably—because we have *fun* doing what we do. Our creative play has been racking up technical, market-share, and mind-share successes at an astounding rate. We\'re proving not only that we can do better software, but that *joy is an asset*.\n' +
    '\n' +
    'Two and a half years after the first version of this essay, the most radical thought I can offer to close with is no longer a vision of an open-source–dominated software world; that, after all, looks plausible to a lot of sober people in suits these days.\n' +
    '\n' +
    'Rather, I want to suggest what may be a wider lesson about software, (and probably about every kind of creative or professional work). Human beings generally take pleasure in a task when it falls in a sort of optimal-challenge zone; not so easy as to be boring, not too hard to achieve. A happy programmer is one who is neither underutilized nor weighed down with ill-formulated goals and stressful process friction. *Enjoyment predicts efficiency.*\n' +
    '\n' +
    'Relating to your own work process with fear and loathing (even in the displaced, ironic way suggested by hanging up Dilbert cartoons) should therefore be regarded in itself as a sign that the process has failed. Joy, humor, and playfulness are indeed assets; it was not mainly for the alliteration that I wrote of "happy hordes" above, and it is no mere joke that the Linux mascot is a cuddly, neotenous penguin.\n' +
    '\n' +
    'It may well turn out that one of the most important effects of open source\'s success will be to teach us that play is the most economically efficient mode of creative work.\n' +
    '\n' +
    '#### Epilog: Netscape Embraces the Bazaar\n' +
    '\n' +
    'It\'s a strange feeling to realize you\'re helping make history....\n' +
    '\n' +
    'On January 22 1998, approximately seven months after I first published *The Cathedral and the Bazaar*, Netscape Communications, Inc. announced plans to [give away the source for Netscape Communicator](http://www.netscape.com/newsref/pr/newsrelease558.html). I had had no clue this was going to happen before the day of the announcement.\n' +
    '\n' +
    'Eric Hahn, executive vice president and chief technology officer at Netscape, emailed me shortly afterwards as follows: \'\'On behalf of everyone at Netscape, I want to thank you for helping us get to this point in the first place. Your thinking and writings were fundamental inspirations to our decision.\'\'\n' +
    '\n' +
    'The following week I flew out to Silicon Valley at Netscape\'s invitation for a day-long strategy conference (on 4 Feb 1998) with some of their top executives and technical people. We designed Netscape\'s source-release strategy and license together.\n' +
    '\n' +
    'A few days later I wrote the following:\n' +
    '\n' +
    '> Netscape is about to provide us with a large-scale, real-world test of the bazaar model in the commercial world. The open-source culture now faces a danger; if Netscape\'s execution doesn\'t work, the open-source concept may be so discredited that the commercial world won\'t touch it again for another decade.\n' +
    '>\n' +
    '> On the other hand, this is also a spectacular opportunity. Initial reaction to the move on Wall Street and elsewhere has been cautiously positive. We\'re being given a chance to prove ourselves, too. If Netscape regains substantial market share through this move, it just may set off a long-overdue revolution in the software industry.\n' +
    '>\n' +
    '> The next year should be a very instructive and interesting time.\n' +
    '\n' +
    'And indeed it was. As I write in mid-2000, the development of what was later named Mozilla has been only a qualified success. It achieved Netscape\'s original goal, which was to deny Microsoft a monopoly lock on the browser market. It has also achieved some dramatic successes (notably the release of the next-generation Gecko rendering engine).\n' +
    '\n' +
    'However, it has not yet garnered the massive development effort from outside Netscape that the Mozilla founders had originally hoped for. The problem here seems to be that for a long time the Mozilla distribution actually broke one of the basic rules of the bazaar model; it didn\'t ship with something potential contributors could easily run and see working. (Until more than a year after release, building Mozilla from source required a license for the proprietary Motif library.)\n' +
    '\n' +
    'Most negatively (from the point of view of the outside world) the Mozilla group didn\'t ship a production-quality browser for two and a half years after the project launch—and in 1999 one of the project\'s principals caused a bit of a sensation by resigning, complaining of poor management and missed opportunities. \'\'Open source,\'\' he correctly observed, \'\'is not magic pixie dust.\'\'\n' +
    '\n' +
    'And indeed it is not. The long-term prognosis for Mozilla looks dramatically better now (in November 2000) than it did at the time of Jamie Zawinski\'s resignation letter—in the last few weeks the nightly releases have finally passed the critical threshold to production usability. But Jamie was right to point out that going open will not necessarily save an existing project that suffers from ill-defined goals or spaghetti code or any of the software engineering\'s other chronic ills. Mozilla has managed to provide an example simultaneously of how open source can succeed and how it could fail.\n' +
    '\n' +
    'In the mean time, however, the open-source idea has scored successes and found backers elsewhere. Since the Netscape release we\'ve seen a tremendous explosion of interest in the open-source development model, a trend both driven by and driving the continuing success of the Linux operating system. The trend Mozilla touched off is continuing at an accelerating rate.\n' +
    '\n' +
    '#### Notes\n' +
    '\n' +
    '*[JB]* In *Programing Pearls*, the noted computer-science aphorist Jon Bentley comments on Brooks\'s observation with \'\'If you plan to throw one away, you will throw away two.\'\'. He is almost certainly right. The point of Brooks\'s observation, and Bentley\'s, isn\'t merely that you should expect first attempt to be wrong, it\'s that starting over with the right idea is usually more effective than trying to salvage a mess.\n' +
    '\n' +
    '*[QR]* Examples of successful open-source, bazaar development predating the Internet explosion and unrelated to the Unix and Internet traditions have existed. The development of the [info-Zip](http://www.cdrom.com/pub/infozip/) compression utility during 1990–x1992, primarily for DOS machines, was one such example. Another was the RBBS bulletin board system (again for DOS), which began in 1983 and developed a sufficiently strong community that there have been fairly regular releases up to the present (mid-1999) despite the huge technical advantages of Internet mail and file-sharing over local BBSs. While the info-Zip community relied to some extent on Internet mail, the RBBS developer culture was actually able to base a substantial on-line community on RBBS that was completely independent of the TCP/IP infrastructure.\n' +
    '\n' +
    '*[CV]* That transparency and peer review are valuable for taming the complexity of OS development turns out, after all, not to be a new concept. In 1965, very early in the history of time-sharing operating systems, Corbató and Vyssotsky, co-designers of the Multics operating system, [wrote](http://www.multicians.org/fjcc1.html)\n' +
    '\n' +
    '> It is expected that the Multics system will be published when it is operating substantially... Such publication is desirable for two reasons: First, the system should withstand public scrutiny and criticism volunteered by interested readers; second, in an age of increasing complexity, it is an obligation to present and future system designers to make the inner operating system as lucid as possible so as to reveal the basic system issues.\n' +
    '\n' +
    '*[JH]* John Hasler has suggested an interesting explanation for the fact that duplication of effort doesn\'t seem to be a net drag on open-source development. He proposes what I\'ll dub \'\'Hasler\'s Law\'\': the costs of duplicated work tend to scale sub-qadratically with team size—that is, more slowly than the planning and management overhead that would be needed to eliminate them.\n' +
    '\n' +
    'This claim actually does not contradict Brooks\'s Law. It may be the case that total complexity overhead and vulnerability to bugs scales with the square of team size, but that the costs from *duplicated* work are nevertheless a special case that scales more slowly. It\'s not hard to develop plausible reasons for this, starting with the undoubted fact that it is much easier to agree on functional boundaries between different developers\' code that will prevent duplication of effort than it is to prevent the kinds of unplanned bad interactions across the whole system that underly most bugs.\n' +
    '\n' +
    'The combination of Linus\'s Law and Hasler\'s Law suggests that there are actually three critical size regimes in software projects. On small projects (I would say one to at most three developers) no management structure more elaborate than picking a lead programmer is needed. And there is some intermediate range above that in which the cost of traditional management is relatively low, so its benefits from avoiding duplication of effort, bug-tracking, and pushing to see that details are not overlooked actually net out positive.\n' +
    '\n' +
    'Above that, however, the combination of Linus\'s Law and Hasler\'s Law suggests there is a large-project range in which the costs and problems of traditional management rise much faster than the expected cost from duplication of effort. Not the least of these costs is a structural inability to harness the many-eyeballs effect, which (as we\'ve seen) seems to do a much better job than traditional management at making sure bugs and details are not overlooked. Thus, in the large-project case, the combination of these laws effectively drives the net payoff of traditional management to zero.\n' +
    '\n' +
    '*[HBS]* The split between Linux\'s experimental and stable versions has another function related to, but distinct from, hedging risk. The split attacks another problem: the deadliness of deadlines. When programmers are held both to an immutable feature list and a fixed drop-dead date, quality goes out the window and there is likely a colossal mess in the making. I am indebted to Marco Iansiti and Alan MacCormack of the Harvard Business School for showing me me evidence that relaxing either one of these constraints can make scheduling workable.\n' +
    '\n' +
    'One way to do this is to fix the deadline but leave the feature list flexible, allowing features to drop off if not completed by deadline. This is essentially the strategy of the "stable" kernel branch; Alan Cox (the stable-kernel maintainer) puts out releases at fairly regular intervals, but makes no guarantees about when particular bugs will be fixed or what features will beback-ported from the experimental branch.\n' +
    '\n' +
    'The other way to do this is to set a desired feature list and deliver only when it is done. This is essentially the strategy of the "experimental" kernel branch. De Marco and Lister cited research showing that this scheduling policy ("wake me up when it\'s done") produces not only the highest quality but, on average, shorter delivery times than either "realistic" or "aggressive" scheduling.\n' +
    '\n' +
    'I have come to suspect (as of early 2000) that in earlier versions of this essay I severely underestimated the importance of the "wake me up when it\'s done" anti-deadline policy to the open-source community\'s productivity and quality. General experience with the rushed GNOME 1.0 release in 1999 suggests that pressure for a premature release can neutralize many of the quality benefits open source normally confers.\n' +
    '\n' +
    'It may well turn out to be that the process transparency of open source is one of three co-equal drivers of its quality, along with "wake me up when it\'s done" scheduling and developer self-selection.\n' +
    '\n' +
    '*[SU]* It\'s tempting, and not entirely inaccurate, to see the core-plus-halo organization characteristic of open-source projects as an Internet-enabled spin on Brooks\'s own recommendation for solving the N-squared complexity problem, the "surgical-team" organization—but the differences are significant. The constellation of specialist roles such as "code librarian" that Brooks envisioned around the team leader doesn\'t really exist; those roles are executed instead by generalists aided by toolsets quite a bit more powerful than those of Brooks\'s day. Also, the open-source culture leans heavily on strong Unix traditions of modularity, APIs, and information hiding—none of which were elements of Brooks\'s prescription.\n' +
    '\n' +
    '*[RJ]* The respondent who pointed out to me the effect of widely varying trace path lengths on the difficulty of characterizing a bug speculated that trace-path difficulty for multiple symptoms of the same bug varies "exponentially" (which I take to mean on a Gaussian or Poisson distribution, and agree seems very plausible). If it is experimentally possible to get a handle on the shape of this distribution, that would be extremely valuable data. Large departures from a flat equal-probability distribution of trace difficulty would suggest that even solo developers should emulate the bazaar strategy by bounding the time they spend on tracing a given symptom before they switch to another. Persistence may not always be a virtue...\n' +
    '\n' +
    '*[IN]* An issue related to whether one can start projects from zero in the bazaar style is whether the bazaar style is capable of supporting truly innovative work. Some claim that, lacking strong leadership, the bazaar can only handle the cloning and improvement of ideas already present at the engineering state of the art, but is unable to push the state of the art. This argument was perhaps most infamously made by the [Halloween Documents](http://www.opensource.org/halloween/), two embarrassing internal Microsoft memoranda written about the open-source phenomenon. The authors compared Linux\'s development of a Unix-like operating system to \'\'chasing taillights\'\', and opined \'\'(once a project has achieved "parity" with the state-of-the-art), the level of management necessary to push towards new frontiers becomes massive.\'\'\n' +
    '\n' +
    'There are serious errors of fact implied in this argument. One is exposed when the Halloween authors themseselves later observe that \'\'often [...] new research ideas are first implemented and available on Linux before they are available / incorporated into other platforms.\'\'\n' +
    '\n' +
    'If we read \'\'open source\'\' for \'\'Linux\'\', we see that this is far from a new phenomenon. Historically, the open-source community did not invent Emacs or the World Wide Web or the Internet itself by chasing taillights or being massively managed—and in the present, there is so much innovative work going on in open source that one is spoiled for choice. The GNOME project (to pick one of many) is pushing the state of the art in GUIs and object technology hard enough to have attracted considerable notice in the computer trade press well outside the Linux community. Other examples are legion, as a visit to [Freshmeat](http://freshmeat.net/) on any given day will quickly prove.\n' +
    '\n' +
    'But there is a more fundamental error in the implicit assumption that the *cathedral model* (or the bazaar model, or any other kind of management structure) can somehow make innovation happen reliably. This is nonsense. Gangs don\'t have breakthrough insights—even volunteer groups of bazaar anarchists are usually incapable of genuine originality, let alone corporate committees of people with a survival stake in some status quo ante. *Insight comes from individuals.* The most their surrounding social machinery can ever hope to do is to be *responsive* to breakthrough insights—to nourish and reward and rigorously test them instead of squashing them.\n' +
    '\n' +
    'Some will characterize this as a romantic view, a reversion to outmoded lone-inventor stereotypes. Not so; I am not asserting that groups are incapable of *developing* breakthrough insights once they have been hatched; indeed, we learn from the peer-review process that such development groups are essential to producing a high-quality result. Rather I am pointing out that every such group development starts from—is necessarily sparked by—one good idea in one person\'s head. Cathedrals and bazaars and other social structures can catch that lightning and refine it, but they cannot make it on demand.\n' +
    '\n' +
    'Therefore the root problem of innovation (in software, or anywhere else) is indeed how not to squash it—but, even more fundamentally, it is *how to grow lots of people who can have insights in the first place*.\n' +
    '\n' +
    'To suppose that cathedral-style development could manage this trick but the low entry barriers and process fluidity of the bazaar cannot would be absurd. If what it takes is one person with one good idea, then a social milieu in which one person can rapidly attract the cooperation of hundreds or thousands of others with that good idea is going inevitably to out-innovate any in which the person has to do a political sales job to a hierarchy before he can work on his idea without risk of getting fired.\n' +
    '\n' +
    'And, indeed, if we look at the history of software innovation by organizations using the cathedral model, we quickly find it is rather rare. Large corporations rely on university research for new ideas (thus the Halloween Documents authors\' unease about Linux\'s facility at coopting that research more rapidly). Or they buy out small companies built around some innovator\'s brain. In neither case is the innovation native to the cathedral culture; indeed, many innovations so imported end up being quietly suffocated under the "massive level of management" the Halloween Documents\' authors so extol.\n' +
    '\n' +
    'That, however, is a negative point. The reader would be better served by a positive one. I suggest, as an experiment, the following:\n' +
    '\n' +
    '- Pick a criterion for originality that you believe you can apply consistently. If your definition is \'\'I know it when I see it\'\', that\'s not a problem for purposes of this test.\n' +
    '- Pick any closed-source operating system competing with Linux, and a best source for accounts of current development work on it.\n' +
    '- Watch that source and Freshmeat for one month. Every day, count the number of release announcements on Freshmeat that you consider \'original\' work. Apply the same definition of \'original\' to announcements for that other OS and count them.\n' +
    '- Thirty days later, total up both figures.\n' +
    '\n' +
    'The day I wrote this, Freshmeat carried twenty-two release announcements, of which three appear they might push state of the art in some respect, This was a slow day for Freshmeat, but I will be astonished if any reader reports as many as three likely innovations *a month* in any closed-source channel.\n' +
    '\n' +
    '*[EGCS]* We now have history on a project that, in several ways, may provide a more indicative test of the bazaar premise than fetchmail; [EGCS](http://egcs.cygnus.com/), the Experimental GNU Compiler System.\n' +
    '\n' +
    'This project was announced in mid-August of 1997 as a conscious attempt to apply the ideas in the early public versions of *The Cathedral and the Bazaar*. The project founders felt that the development of GCC, the Gnu C Compiler, had been stagnating. For about twenty months afterwards, GCC and EGCS continued as parallel products—both drawing from the same Internet developer population, both starting from the same GCC source base, both using pretty much the same Unix toolsets and development environment. The projects differed only in that EGCS consciously tried to apply the bazaar tactics I have previously described, while GCC retained a more cathedral-like organization with a closed developer group and infrequent releases.\n' +
    '\n' +
    'This was about as close to a controlled experiment as one could ask for, and the results were dramatic. Within months, the EGCS versions had pulled substantially ahead in features; better optimization, better support for FORTRAN and C++. Many people found the EGCS development snapshots to be more reliable than the most recent stable version of GCC, and major Linux distributions began to switch to EGCS.\n' +
    '\n' +
    'In April of 1999, the Free Software Foundation (the official sponsors of GCC) dissolved the original GCC development group and officially handed control of the project to the the EGCS steering team.\n' +
    '\n' +
    '*[SP]* Of course, Kropotkin\'s critique and Linus\'s Law raise some wider issues about the cybernetics of social organizations. Another folk theorem of software engineering suggests one of them; Conway\'s Law—commonly stated as \'\'If you have four groups working on a compiler, you\'ll get a 4-pass compiler\'\'. The original statement was more general: \'\'Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations.\'\' We might put it more succinctly as \'\'The means determine the ends\'\', or even \'\'Process becomes product\'\'.\n' +
    '\n' +
    'It is accordingly worth noting that in the open-source community organizational form and function match on many levels. The network is everything and everywhere: not just the Internet, but the people doing the work form a distributed, loosely coupled, peer-to-peer network that provides multiple redundancy and degrades very gracefully. In both networks, each node is important only to the extent that other nodes want to cooperate with it.\n' +
    '\n' +
    'The peer-to-peer part is essential to the community\'s astonishing productivity. The point Kropotkin was trying to make about power relationships is developed further by the \'SNAFU Principle\': \'\'True communication is possible only between equals, because inferiors are more consistently rewarded for telling their superiors pleasant lies than for telling the truth.\'\' Creative teamwork utterly depends on true communication and is thus very seriously hindered by the presence of power relationships. The open-source community, effectively free of such power relationships, is teaching us by contrast how dreadfully much they cost in bugs, in lowered productivity, and in lost opportunities.\n' +
    '\n' +
    'Further, the SNAFU principle predicts in authoritarian organizations a progressive disconnect between decision-makers and reality, as more and more of the input to those who decide tends to become pleasant lies. The way this plays out in conventional software development is easy to see; there are strong incentives for the inferiors to hide, ignore, and minimize problems. When this process becomes product, software is a disaster.';



export const test_md = "# Markdown: Syntax\n" +
    "\n" +
    "*   [Overview](#overview)\n" +
    "    *   [Philosophy](#philosophy)\n" +
    "    *   [Inline HTML](#html)\n" +
    "    *   [Automatic Escaping for Special Characters](#autoescape)\n" +
    "*   [Block Elements](#block)\n" +
    "    *   [Paragraphs and Line Breaks](#p)\n" +
    "    *   [Headers](#header)\n" +
    "    *   [Blockquotes](#blockquote)\n" +
    "    *   [Lists](#list)\n" +
    "    *   [Code Blocks](#precode)\n" +
    "    *   [Horizontal Rules](#hr)\n" +
    "*   [Span Elements](#span)\n" +
    "    *   [Links](#link)\n" +
    "    *   [Emphasis](#em)\n" +
    "    *   [Code](#code)\n" +
    "    *   [Images](#img)\n" +
    "*   [Miscellaneous](#misc)\n" +
    "    *   [Backslash Escapes](#backslash)\n" +
    "    *   [Automatic Links](#autolink)\n" +
    "\n" +
    "\n" +
    "**Note:** This document is itself written using Markdown; you\n" +
    "can [see the source for it by adding '.text' to the URL](/projects/markdown/syntax.text).\n" +
    "\n" +
    "----\n" +
    "\n" +
    "## Overview\n" +
    "\n" +
    "### Philosophy\n" +
    "\n" +
    "Markdown is intended to be as easy-to-read and easy-to-write as is feasible.\n" +
    "\n" +
    "Readability, however, is emphasized above all else. A Markdown-formatted\n" +
    "document should be publishable as-is, as plain text, without looking\n" +
    "like it's been marked up with tags or formatting instructions. While\n" +
    "Markdown's syntax has been influenced by several existing text-to-HTML\n" +
    "filters -- including [Setext](http://docutils.sourceforge.net/mirror/setext.html), [atx](http://www.aaronsw.com/2002/atx/), [Textile](http://textism.com/tools/textile/), [reStructuredText](http://docutils.sourceforge.net/rst.html),\n" +
    "[Grutatext](http://www.triptico.com/software/grutatxt.html), and [EtText](http://ettext.taint.org/doc/) -- the single biggest source of\n" +
    "inspiration for Markdown's syntax is the format of plain text email.\n" +
    "\n" +
    "## Block Elements\n" +
    "\n" +
    "### Paragraphs and Line Breaks\n" +
    "\n" +
    "A paragraph is simply one or more consecutive lines of text, separated\n" +
    "by one or more blank lines. (A blank line is any line that looks like a\n" +
    "blank line -- a line containing nothing but spaces or tabs is considered\n" +
    "blank.) Normal paragraphs should not be indented with spaces or tabs.\n" +
    "\n" +
    "The implication of the \"one or more consecutive lines of text\" rule is\n" +
    "that Markdown supports \"hard-wrapped\" text paragraphs. This differs\n" +
    "significantly from most other text-to-HTML formatters (including Movable\n" +
    "Type's \"Convert Line Breaks\" option) which translate every line break\n" +
    "character in a paragraph into a `<br />` tag.\n" +
    "\n" +
    "When you *do* want to insert a `<br />` break tag using Markdown, you\n" +
    "end a line with two or more spaces, then type return.\n" +
    "\n" +
    "### Headers\n" +
    "\n" +
    "Markdown supports two styles of headers, [Setext] [1] and [atx] [2].\n" +
    "\n" +
    "Optionally, you may \"close\" atx-style headers. This is purely\n" +
    "cosmetic -- you can use this if you think it looks better. The\n" +
    "closing hashes don't even need to match the number of hashes\n" +
    "used to open the header. (The number of opening hashes\n" +
    "determines the header level.)\n" +
    "\n" +
    "\n" +
    "### Blockquotes\n" +
    "\n" +
    "Markdown uses email-style `>` characters for blockquoting. If you're\n" +
    "familiar with quoting passages of text in an email message, then you\n" +
    "know how to create a blockquote in Markdown. It looks best if you hard\n" +
    "wrap the text and put a `>` before every line:\n" +
    "\n" +
    "> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,\n" +
    "> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.\n" +
    "> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.\n" +
    "> \n" +
    "> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse\n" +
    "> id sem consectetuer libero luctus adipiscing.\n" +
    "\n" +
    "Markdown allows you to be lazy and only put the `>` before the first\n" +
    "line of a hard-wrapped paragraph:\n" +
    "\n" +
    "> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,\n" +
    "consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.\n" +
    "Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.\n" +
    "\n" +
    "> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse\n" +
    "id sem consectetuer libero luctus adipiscing.\n" +
    "\n" +
    "Blockquotes can be nested (i.e. a blockquote-in-a-blockquote) by\n" +
    "adding additional levels of `>`:\n" +
    "\n" +
    "> This is the first level of quoting.\n" +
    ">\n" +
    "> > This is nested blockquote.\n" +
    ">\n" +
    "> Back to the first level.\n" +
    "\n" +
    "Blockquotes can contain other Markdown elements, including headers, lists,\n" +
    "and code blocks:\n" +
    "\n" +
    "> ## This is a header.\n" +
    "> \n" +
    "> 1.   This is the first list item.\n" +
    "> 2.   This is the second list item.\n" +
    "> \n" +
    "> Here's some example code:\n" +
    "> \n" +
    ">     return shell_exec(\"echo $input | $markdown_script\");\n" +
    "\n" +
    "Any decent text editor should make email-style quoting easy. For\n" +
    "example, with BBEdit, you can make a selection and choose Increase\n" +
    "Quote Level from the Text menu.\n" +
    "\n" +
    "\n" +
    "### Lists\n" +
    "\n" +
    "Markdown supports ordered (numbered) and unordered (bulleted) lists.\n" +
    "\n" +
    "Unordered lists use asterisks, pluses, and hyphens -- interchangably\n" +
    "-- as list markers:\n" +
    "\n" +
    "*   Red\n" +
    "*   Green\n" +
    "*   Blue\n" +
    "\n" +
    "is equivalent to:\n" +
    "\n" +
    "+   Red\n" +
    "+   Green\n" +
    "+   Blue\n" +
    "\n" +
    "and:\n" +
    "\n" +
    "-   Red\n" +
    "-   Green\n" +
    "-   Blue\n" +
    "\n" +
    "Ordered lists use numbers followed by periods:\n" +
    "\n" +
    "1.  Bird\n" +
    "2.  McHale\n" +
    "3.  Parish\n" +
    "\n" +
    "It's important to note that the actual numbers you use to mark the\n" +
    "list have no effect on the HTML output Markdown produces. The HTML\n" +
    "Markdown produces from the above list is:\n" +
    "\n" +
    "If you instead wrote the list in Markdown like this:\n" +
    "\n" +
    "1.  Bird\n" +
    "1.  McHale\n" +
    "1.  Parish\n" +
    "\n" +
    "or even:\n" +
    "\n" +
    "3. Bird\n" +
    "1. McHale\n" +
    "8. Parish\n" +
    "\n" +
    "you'd get the exact same HTML output. The point is, if you want to,\n" +
    "you can use ordinal numbers in your ordered Markdown lists, so that\n" +
    "the numbers in your source match the numbers in your published HTML.\n" +
    "But if you want to be lazy, you don't have to.\n" +
    "\n" +
    "To make lists look nice, you can wrap items with hanging indents:\n" +
    "\n" +
    "*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n" +
    "    Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,\n" +
    "    viverra nec, fringilla in, laoreet vitae, risus.\n" +
    "*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.\n" +
    "    Suspendisse id sem consectetuer libero luctus adipiscing.\n" +
    "\n" +
    "But if you want to be lazy, you don't have to:\n" +
    "\n" +
    "*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.\n" +
    "Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,\n" +
    "viverra nec, fringilla in, laoreet vitae, risus.\n" +
    "*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.\n" +
    "Suspendisse id sem consectetuer libero luctus adipiscing.\n" +
    "\n" +
    "List items may consist of multiple paragraphs. Each subsequent\n" +
    "paragraph in a list item must be indented by either 4 spaces\n" +
    "or one tab:\n" +
    "\n" +
    "1.  This is a list item with two paragraphs. Lorem ipsum dolor\n" +
    "    sit amet, consectetuer adipiscing elit. Aliquam hendrerit\n" +
    "    mi posuere lectus.\n" +
    "\n" +
    "    Vestibulum enim wisi, viverra nec, fringilla in, laoreet\n" +
    "    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum\n" +
    "    sit amet velit.\n" +
    "\n" +
    "2.  Suspendisse id sem consectetuer libero luctus adipiscing.\n" +
    "\n" +
    "It looks nice if you indent every line of the subsequent\n" +
    "paragraphs, but here again, Markdown will allow you to be\n" +
    "lazy:\n" +
    "\n" +
    "*   This is a list item with two paragraphs.\n" +
    "\n" +
    "    This is the second paragraph in the list item. You're\n" +
    "only required to indent the first line. Lorem ipsum dolor\n" +
    "sit amet, consectetuer adipiscing elit.\n" +
    "\n" +
    "*   Another item in the same list.\n" +
    "\n" +
    "To put a blockquote within a list item, the blockquote's `>`\n" +
    "delimiters need to be indented:\n" +
    "\n" +
    "*   A list item with a blockquote:\n" +
    "\n" +
    "    > This is a blockquote\n" +
    "    > inside a list item.\n" +
    "\n" +
    "To put a code block within a list item, the code block needs\n" +
    "to be indented *twice* -- 8 spaces or two tabs:\n" +
    "\n" +
    "*   A list item with a code block:\n" +
    "\n" +
    "        <code goes here>\n" +
    "\n" +
    "### Code Blocks\n" +
    "\n" +
    "Pre-formatted code blocks are used for writing about programming or\n" +
    "markup source code. Rather than forming normal paragraphs, the lines\n" +
    "of a code block are interpreted literally. Markdown wraps a code block\n" +
    "in both `<pre>` and `<code>` tags.\n" +
    "\n" +
    "To produce a code block in Markdown, simply indent every line of the\n" +
    "block by at least 4 spaces or 1 tab.\n" +
    "\n" +
    "This is a normal paragraph:\n" +
    "\n" +
    "    This is a code block.\n" +
    "\n" +
    "Here is an example of AppleScript:\n" +
    "\n" +
    "    tell application \"Foo\"\n" +
    "        beep\n" +
    "    end tell\n" +
    "\n" +
    "A code block continues until it reaches a line that is not indented\n" +
    "(or the end of the article).\n" +
    "\n" +
    "Within a code block, ampersands (`&`) and angle brackets (`<` and `>`)\n" +
    "are automatically converted into HTML entities. This makes it very\n" +
    "easy to include example HTML source code using Markdown -- just paste\n" +
    "it and indent it, and Markdown will handle the hassle of encoding the\n" +
    "ampersands and angle brackets. For example, this:\n" +
    "\n" +
    "    <div class=\"footer\">\n" +
    "        &copy; 2004 Foo Corporation\n" +
    "    </div>\n" +
    "\n" +
    "Regular Markdown syntax is not processed within code blocks. E.g.,\n" +
    "asterisks are just literal asterisks within a code block. This means\n" +
    "it's also easy to use Markdown to write about Markdown's own syntax.\n" +
    "\n" +
    "```\n" +
    "tell application \"Foo\"\n" +
    "    beep\n" +
    "end tell\n" +
    "```\n" +
    "\n" +
    "## Span Elements\n" +
    "\n" +
    "### Links\n" +
    "\n" +
    "Markdown supports two style of links: *inline* and *reference*.\n" +
    "\n" +
    "In both styles, the link text is delimited by [square brackets].\n" +
    "\n" +
    "To create an inline link, use a set of regular parentheses immediately\n" +
    "after the link text's closing square bracket. Inside the parentheses,\n" +
    "put the URL where you want the link to point, along with an *optional*\n" +
    "title for the link, surrounded in quotes. For example:\n" +
    "\n" +
    "This is [an example](http://example.com/) inline link.\n" +
    "\n" +
    "[This link](http://example.net/) has no title attribute.\n" +
    "\n" +
    "### Emphasis\n" +
    "\n" +
    "Markdown treats asterisks (`*`) and underscores (`_`) as indicators of\n" +
    "emphasis. Text wrapped with one `*` or `_` will be wrapped with an\n" +
    "HTML `<em>` tag; double `*`'s or `_`'s will be wrapped with an HTML\n" +
    "`<strong>` tag. E.g., this input:\n" +
    "\n" +
    "*single asterisks*\n" +
    "\n" +
    "_single underscores_\n" +
    "\n" +
    "**double asterisks**\n" +
    "\n" +
    "__double underscores__\n" +
    "\n" +
    "### Code\n" +
    "\n" +
    "To indicate a span of code, wrap it with backtick quotes (`` ` ``).\n" +
    "Unlike a pre-formatted code block, a code span indicates code within a\n" +
    "normal paragraph. For example:\n" +
    "\n" +
    "Use the `printf()` function.";