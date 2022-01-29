<template>
  <div class="page terms">
    <div class="m_container">
      <div class="terms__inner">
        <div class="terms__sidebar">
            <h1 class="terms__sidebar__title">Terms of Service</h1>
            <div class="terms__sidebar__menu">
              <ul>
                <li v-for="(item, i) in menuItems" :key="item">
                  <a :id="`side${i + 1}`" :class="{active: activeMenuItem === i + 1}" href="#" @click.prevent="scrollToSection(i + 1)">{{ `${i + 1}. ${item}` }}</a>
                </li>
                <!-- <li><a id="side1" :class="{active: activeMenuItem == 1}" href="#" @click.prevent="scrollToSection('1')">Preamble</a></li>
                <li><a id="side2" :class="{active: activeMenuItem == 2}" href="#" @click.prevent="scrollToSection('2')">Definitions</a></li>
                <li><a id="side3" :class="{active: activeMenuItem == 3}" href="#" @click.prevent="scrollToSection('3')">1. Purpose</a></li>
                <li><a id="side4" :class="{active: activeMenuItem == 4}" href="#" @click.prevent="scrollToSection('4')">2. Legal documentation</a></li>
                <li><a id="side5" :class="{active: activeMenuItem == 5}" href="#" @click.prevent="scrollToSection('5')">3. Site and platform accessibility</a></li>
                <li><a id="side6" :class="{active: activeMenuItem == 6}" href="#" @click.prevent="scrollToSection('6')">4. Infrastructure location and security</a></li>
                <li><a id="side7" :class="{active: activeMenuItem == 7}" href="#" @click.prevent="scrollToSection('7')">5. Description of services provided</a></li>
                <li><a id="side8" :class="{active: activeMenuItem == 8}" href="#" @click.prevent="scrollToSection('8')">6. Creating a Vendor account</a></li> -->
              </ul>
            </div>
        </div>
        <div id="terms-main" class="terms__main">
          <div class="terms__main__text">
            <p>January, 2022</p>
          </div>
          <h2 class="terms__main__title" id="main1">{{ getTitle(1) }}</h2>
          <div class="terms__main__text">
            <p>These general terms of service together with the annexes and any documentation they refer to (collectively <strong>“Terms of Use”</strong>) define the terms of use of this website (<strong>“TOPIO”</strong>) and any service, product, site, content, program, interface, software (collectively the <strong>"Services"</strong>) made available through TOPIO.</p>
            <p>The Services are provided by the OpertusMundi Consortium (GA #870228) (hereinafter referred to as <strong>OPC</strong>).</p>
            <p>The Services are exclusively reserved to persons or entities acting in a professional capacity, under private or public law (hereinafter the <strong>« Users »</strong>).</p>
            <p>Services available through TOPIO may include products and services of any type (such as content, data, software, applications, tools, programs and interfaces, the list being indicative and not exhaustive) enabling Users to search, access, trade, purchase, use, edit, process, integrate, enhance, visualize, manage, share, and exploit geospatial assets and any related services.</p>
            <p>In addition to the Terms of Use, the use of any Services may also be subject to additional terms and conditions and other binding agreements (the <strong>“Specific Terms”</strong>). If there is any conflict between the Specific Terms and the Terms of Use, the Specific Terms shall prevail regarding the contradictory provisions. The Terms of Use and any applicable Specific Terms are hereinafter collectively referred to as <strong>“Terms”</strong>.</p>
            <p>By accessing or using any of the Services, Users acknowledge that they have read, understood and agreed to be bound by the Terms.</p>
            <p>The Terms are applicable to the relationship between TOPIO and the User, to the exclusion of all other terms and conditions not expressly accepted by TOPIO, including, in particular, any User terms and conditions.</p>
            <p>TOPIO may modify the Terms at any time. In that case, TOPIO will post updated Terms and indicate the date of revision. All new and/or revised Terms take effect immediately and apply to the use of the Services from that date on, except that material changes will take effect thirty (30) days after the change is made and identified as material. Continued use of any Services after new and/or revised Terms are effective indicates that User has read, understood, and agreed to those Terms.</p>
          </div>
          <h2 class="terms__main__title" id="main2">{{ getTitle(2) }}</h2>
          <div class="terms__main__text">
            <p>Without prejudice to any specific definitions contained in other provisions of the Terms, the terms below shall have the following meanings:</p>
            <p><strong>API</strong> means application programming interface and its associated tools and documentation, designed to allow to access and receive content, data, materials, tools, services.</p>
            <p><strong>Content</strong> means all content of any type, including without limitation, data, text, graphics, maps, metadata, logos, images, illustrations, software, source code, programs, applications, audio and video, and animations.</p>
            <p><strong>Helpdesk</strong> means TOPIO’s resources intended to provide the Users with information and support related to TOPIOS’ Services.</p>
            <p><strong>Intellectual Property Rights</strong> means: (i) copyrights, topography rights, database rights, moral rights, know-how rights; (ii) trade business and company names, Internet domain names and e-mail addresses; (iii) patents, trademarks, designs (registered or unregistered applications); (iv) the goodwill attaching to any of the aforementioned rights; and (v) any forms of protection of a similar nature and having equivalent or similar effect in any jurisdiction, including, but not limited to, any business information that qualify as trade secrets i.e. (a) it is secret in the sense that it is not, as a body or in the precise configuration and assembly of its components, generally known among or readily accessible to persons within the circles that normally deal with the kind of information in question; (b) it has commercial value because it is secret; (c) it has been subject to reasonable steps under the circumstances, by the person lawfully in control of the information, to keep it secret; in each case including applications and rights to apply for any registered right.</p>
            <p><strong>License Agreement</strong> means a binding contractual agreement that Users agree to before being granted access to Content provided via TOPIO.</p>
            <p><strong>Personal Data</strong> means any information relating to an identified or identifiable physical person.</p>
            <p><strong>Supplier</strong> means any User when she makes available Content for purchase or share through TOPIO.</p>
            <p><strong>User Content</strong> means Content supplied or otherwise shared by a User on or through any of the Services.</p>
            <p>Any capitalized terms used, but not defined, herein have the meanings given to them elsewhere in this Agreement as referenced where such terms are used.</p>
          </div>
          <h2 class="terms__main__title" id="main3">{{ getTitle(3) }}</h2>
          <div class="terms__main__text">
            <p>In order to use most Services, Users must register and create a User account (the <strong>“User Account”</strong>). Registration is free of charge, but use of some Services may require remuneration. Any remuneration that may apply will be clearly indicated to the User before User can place the relevant order.</p>
            <p>Registration process will require the User to provide TOPIO with certain corporate, personal, and other information. TOPIO may verify User’s email address before account can be used.</p>
            <p>User agrees to provide truthful and complete information during the whole registration process and to keep that information updated.</p>
            <p>The User’s identity and the accuracy of the information provided during the registration process (or any update) may be subject to verification by TOPIO and/or TOPIO’s agents, partners, subcontractors, and additional information and documentation may be required from the User if necessary.</p>
            <p>User’s identification credentials (such as username, password, API keys, etc.) allowing to access the Services are for User’s use only. User agrees to maintain the confidentiality of and prevent unauthorized use of and must promptly notify TOPIO of any confidentiality breach or unauthorized use of User’s Account or any identification credentials associated with the User’s Account.</p>
            <p>User will be responsible for (i) all uses of any account that User has access to, whether User has authorized the particular use or user, and regardless of User’s knowledge of such use, and (ii) securing its account, passwords, keys (including but not limited to administrative and user passwords) and files. TOPIO is not responsible for any losses, damages, costs, expenses or claims that may result from stolen or lost identification credentials.</p>
          </div>
          <h2 class="terms__main__title" id="main4">{{ getTitle(4) }}</h2>
          <div class="terms__main__text">
            <p>Subject to compliance with the Terms and payment of any amounts due, Users are hereby granted a non-exclusive, revocable, worldwide, non-transferable, non-sublicensable right and license to access and use TOPIO and related Services to use, trade and/or share Content.</p>
            <p>By accessing or using the Services, User grants TOPIO a non-exclusive, worldwide, sub-licensable, assignable license to access, use, copy, store, display the User Content only to the extent necessary to provide the Services agreed upon between TOPIO and the User in accordance with the Terms.</p>
            <p>Each User represents, warrants, and agrees that (i) User Content is not fraudulent, tortious or otherwise in violation of any applicable law or any right of any third party, (ii) User holds all appropriate title and/or license rights on User Content and that no User Content violates or infringes upon the Intellectual Property Rights of any third party and (iii) User has the right to grant TOPIO these rights and shall hold TOPIO harmless in the event of any claim to the contrary from any third party.</p>
            <p>Unless there are separate express provisions to the contrary, User represents and warrants that User Content is complete and accurate.</p>
            <p>TOPIO is not responsible for User Content used via the Services.</p>
            <p>Information relevant with User Content made available via TOPIO’s Services may, on a case-by-case basis and upon the Helpdesk’s sole discretion, be vetted by the Helpdesk and additional information may be required before Content’s offer is published on TOPIO’s marketplace. Upon the Helpdesk’s acceptance, offer of relevant Content will be published upon Supplier’s sole initiative and under Supplier’s own responsibility.</p>
            <p>Suppliers may at any time edit and revise all published information for their Content and block access or remove them from the marketplace, suspending or terminating the publication of their offer. Suppliers shall nonetheless remain liable for any binding transactions already concluded via TOPIO and shall comply with all existing obligations towards TOPIO and/or other Users.</p>
            <p>It is each User’s responsibility to review and agree to any additional terms, conditions and policies that apply before using Content provided via TOPIO.</p>
            <p>TOPIO may, but is not required to, monitor, evaluate, alter, block, remove or disable access to all or part of Content that is not compliant with the Terms or any applicable laws and regulations.</p>
            <p>Each User remains solely responsible for taking backup copies of Content supplied or used. If the Services are discontinued or cancelled, TOPIO may permanently delete User Content. TOPIO has no obligation to return User Content to the User after the Services are discontinued or cancelled or in the event the User’s Account is suspended or terminated for any reason whatsoever.</p>
          </div>
          <h2 class="terms__main__title" id="main5">{{ getTitle(5) }}</h2>
          <div class="terms__main__text">
            <p>Suppliers may make available their Content via APIs specifically created by TOPIO (hereinafter <strong>“Provisioned APIs”</strong>). In this case, TOPIO will be responsible for creating, publishing and supporting Provisioned APIs based on the Content provided by Supplier. Supplier alone will remain liable for Content they provide to be used for Provisioned APIs.</p>
          </div>
          <h2 class="terms__main__title" id="main6">{{ getTitle(6) }}</h2>
          <div class="terms__main__text">
            <p>TOPIO provides access to Users to a set of tools and services allowing them to offer, search, find, evaluate, purchase and/or share Content.</p>
            <p>When presenting Content, TOPIO’s ranking mechanism takes account of the characteristics of the offers available and the relevance of those characteristics to Users that initiate the search.</p>

            <p>
              The ranking of explicit (i.e., search engine) and implicit (i.e., recommendations) search results for geospatial assets in TOPIO is:
              <ol type="i">
                <li>entirely automated via algorithmic means based on the ranking parameters presented next,</li>
                <li>impartial towards geospatial assets suppliers,</li>
                <li>not influenced in any way by direct or indirect remuneration, and</li>
                <li>solely dictated by the need to ensure that Users will find Content that will be the closest to their needs.</li>
              </ol>
            </p>

            <p>TOPIO does not provide the possibility for Suppliers to influence ranking against any direct or indirect remuneration. </p>
            <p>It is reminded that “direct remuneration” consists in payments made with the main or sole aim to improve ranking and indirect remuneration refers to any remuneration in the form of the acceptance by a business user of additional obligations of any kind which may have this improved ranking as its practical effect.</p>
            <p>Even if some Suppliers use ancillary services provided by TOPIO, and TOPIO’s partners, such use of ancillary services or any other paid features provided by TOPIO will not have an impact on the ranking of Supplier’s Content.</p>
            <p>The ranking of search results takes into consideration the following performance-based and relevance-based criteria, listed below by order of decreasing relevant importance:</p>

            <ul>
              <li>Search-related inputs and filters applied by Users</li>
              <li>Content Title and Description</li>
              <li>Content Type and format</li>
              <li>Content popularity (i.e., number of views from Users) and revenues (i.e., sales performance)</li>
              <li>Content availability for delivery via TOPIO</li>
              <li>Content tags and indicated thematic coverage</li>
              <li>Content geospatial and temporal coverage</li>
              <li>Content level of detail and granularity</li>
              <li>Content characteristics and inferred quality based on automated metadata (profiling) extracted by TOPIO</li>
              <li>Content joinability with other assets</li>
              <li>Content metadata as provided by the Supplier</li>
              <li>User profile and preferences</li>
              <li>Content reviews from Users (e.g., ratings, number of disputes)</li>
              <li>Content documentation</li>
              <li>Editorial interventions (e.g., editor’s ‘top picks’, ‘featured’, ‘deals of the day’)</li>
            </ul>

            <p>Users acknowledge that TOPIO cannot be responsible for any Content’s position or views obtained after any search using TOPIO’s interface.</p>
            <p>TOPIO cannot guarantee any specific ranking or consistent position in search results for any Content.</p>
          </div>
          <h2 class="terms__main__title" id="main7">{{ getTitle(7) }}</h2>
          <div class="terms__main__text">
            <p>Suppliers are offered the possibility to host their Content in their own allocated and limited space provided by TOPIO for free.</p>
            <p>Additional storage space may require a specific subscription and be subject to additional fees.</p>
            <p>In the event the subscription is accepted for a specific term, no refund will be allowed for subscriptions cancelled before their termination date in the absence of any breach of TOPIO’s obligations.</p>
          </div>
          <h2 class="terms__main__title" id="main8">{{ getTitle(8) }}</h2>
          <div class="terms__main__text">
            <p>TOPIO provides Suppliers with access to a series of interactive tools allowing them to produce and customize template License Agreements and assign them to the Content they make available via TOPIO’s marketplace.</p>
            <p>The proposed template License Agreements have a variable content and include a variety of clauses. The relevant Services offered by TOPIO allow Suppliers to configure one or more template agreements, based on a list of standard clauses proposed.</p>
            <p>Each Supplier defines, under her sole and exclusive responsibility, the adequacy of the parameters she selects in each template agreement with her expectations and needs. In no event shall these templates and clauses proposed via the Services constitute or be construed as legal advice, canvassing, solicitation or offer of legal services from TOPIO.</p>
            <p>Access to Content is granted to Users if they agree to be bound by the corresponding License Agreement.</p>
            <p>Users acknowledge that they remain entirely responsible for all choices made regarding the use, exhaustivity and fitness for purpose of each clause of the License Agreement(s) they enter into via TOPIO’s marketplace and any interpretations and commercial and legal binding consequences that may derive from them.</p>
            <p>TOPIO cannot be held liable by any User or third party, on any grounds whatsoever, in relation to the standard clauses proposed via the Services and/or in relation to the conclusion and performance of the binding agreement between a Supplier and any other User resulting from the settings chosen by the Supplier and accepted by the User before entering into any binding agreement.</p>
            <p>Unless there are express provisions to the contrary, TOPIO is not a party to any License Agreement entered into by and between Suppliers and other Users via TOPIO’s Services.</p>
          </div>
          <h2 class="terms__main__title" id="main9">{{ getTitle(9) }}</h2>
          <div class="terms__main__text">
            <p>Upon conclusion of the relevant License Agreement and subject to payment due, access to the Content is ensured according to the delivery method chosen by the parties and specified in the License Agreement, either directly via TOPIO’s Services or via Supplier’s own means.</p>
            <p>Delivery process requires that (i) the payment is duly processed in advance and (ii) Content delivered corresponds to the metadata published via TOPIO.</p>
            <p>Unless expressly agreed otherwise, dates quoted for delivery are approximate only.</p>
            <p>In no event may TOPIO be held liable for any delay or failure to deliver, in whole or in part, if parties choose a delivery process via Supplier’s own means.</p>
          </div>
          <h2 class="terms__main__title" id="main10">{{ getTitle(10) }}</h2>
          <div class="terms__main__text">
            <p>Prices for Content made available via TOPIO’s Services are freely determined by the Supplier via one or more of the applicable pricing models that are supported by the marketplace.</p>
            <p>All prices shown on TOPIO’s marketplace are exclusive of sales taxes, value added tax and import duties, shipping costs and bank and credit card fees or other payment processing fees. Applicable taxes, costs and fees will be shown separately for information purposes before the User is asked to confirm an order.</p>
            <p>Prices are subject to change at any time and without notice. The applicable price due by a User will be the price shown in the order accepted by the User and included in the relevant License Agreement.</p>
          </div>
          <h2 class="terms__main__title" id="main11">{{ getTitle(11) }}</h2>
          <div class="terms__main__text">
            <p>Payments are due in accordance with the provisions of the License Agreement and processed via a third-party payment service provider, MANGOPAY.</p>
            <p>MANGOPAY is a public limited company (“société anonyme”) under Luxembourg law with a capital of 18,700,000 euros, whose registered office is located at 2 Avenue Amélie, L-1125 Luxembourg, registered with the Luxembourg Trade and Companies Register under number B173459, and licensed as an Electronic Money Institution by the Commission de Surveillance du Secteur Financier (CSSF).</p>
            <p>The payment process is subject to MANGOPAY’s general terms and conditions available at https://www.mangopay.com/terms/MANGOPAY_Terms-EN.pdf that are incorporated in the Terms and that each User expressly agrees to.</p>
            <p>In order to proceed with a payment transaction, Users will be required to supply certain relevant information, such as credit card number and its expiration date and/or bank account number, billing address. Each User represents and warrants that User has the right to use any credit card and bank account for which User provides information in connection with a payment transaction. By submitting such information, User grants TOPIO the right to provide such information to MANGOPAY and any other third parties that may be required to intervene for purposes of facilitating payment transactions. Verification of information may be required prior to the acknowledgment or completion of any payment transaction. User will pay all charges incurred relevant with the processing of the payment transaction, at the prices in effect when such charges are incurred, as stated in the order submitted to User’s prior confirmation. TOPIO reserves the right to change the payment service provided at any time.</p>
          </div>
          <h2 class="terms__main__title" id="main12">{{ getTitle(12) }}</h2>
          <div class="terms__main__text">
            <p>Any disputes between Suppliers and other Users or between TOPIO and any Users regarding License Agreements concluded via TOPIO’s Services are resolved directly between the parties identified in the relevant License Agreement.</p>
            <p>TOPIO provides Users with a series of tools allowing them to communicate and address complaints relevant with the interpretation, performance and termination of License Agreements concluded via TOPIO’s Services.</p>
            <p>If no solution can be found directly between the parties concerned, TOPIO’s Helpdesk may contact each one of them and request information in order to suggest a reasonable acceptable remedy to the situation.</p>
            <p>In any case, all parties are reminded of their right to engage, in the event of a dispute, mediation proceedings or any other alternative dispute resolution process provided by applicable law.</p>
            <p>TOPIO may not be held accountable for any outcome that may occur in the event of a dispute between Users.</p>
          </div>
          <h2 class="terms__main__title" id="main13">{{ getTitle(13) }}</h2>
          <div class="terms__main__text">
            <p>TOPIO’s Services are performed with appropriate and reasonable skill and care in accordance with the Terms and industry best practice.</p>
            <p>TOPIO’s marketplace is accessible 24 hours a day, 7 days a week, with the possible occurrence of accidental or necessary interruption required for proper performance of the Services, such as maintenance operations. Such interruptions shall not entail to any type of compensation.</p>
            <p>Notwithstanding any of the above, the availability of the Services may vary and is subject to TOPIO’s sole discretion. TOPIO may, in its sole discretion, change, correct or discontinue the Services in whole or in part. TOPIO expressly disclaims any representation or warranty that any specific Services will remain available. The Services may not be available in all countries and may be provided only in selected languages. The Services, operations and some features may also be dependent on the network, compatibility of the devices used, and the content formats supported.</p>
            <p>Each User acknowledges that TOPIO is not responsible for any delays, delivery failures, or any other loss or damage resulting from the transfer of data over communications networks and facilities (including the internet) which are not within TOPIO’s reasonable control and that the Services may be subject to limitations, delays and other problems inherent in the use of such communications facilities.</p>
            <p>
              The Services’ availability and performance also depends on the respect by each User of the following undertakings:
              <ol type="i">
                <li>provide TOPIO with all necessary co-operation in relation to the performance of the Services;</li>
                <li>comply with applicable laws and regulations with respect to User’s respective activities;</li>
                <li>carry out User’s responsibilities set out in the Terms in a timely and efficient manner.</li>
              </ol>
            </p>
          </div>
          <h2 class="terms__main__title" id="main14">{{ getTitle(14) }}</h2>
          <div class="terms__main__text">
            <p>
              Users undertake not to:
              <ol type="i">
                <li>use the Services for any purpose that is fraudulent or otherwise tortious or unlawful or causes damage or injury to any person or property or interferes with any other person’s use of the Services or that infringes any other person’s Intellectual Property Rights (or other personal or proprietary rights), or breaches or conflicts with any obligation, such as a confidentiality obligation;</li>
                <li>remove or obscure any proprietary notices, logos or identification labels contained in or on Services or other materials Users receive or have access to via the Services;</li>
                <li>promote, facilitate, or encourage any illegal activity;</li>
                <li>use the Services in any manner that violates any applicable industry standards, third-party policies, or requirements that TOPIO may communicate to its Users;</li>
                <li>harvest or collect information about Users of the Services;</li>
                <li>use contact information obtained through TOPIO’s Services to engage in any action between Users designed to complete or facilitate a transaction outside of the marketplace;</li>
                <li>create a false identity, impersonate another person or otherwise attempt to mislead others as to the identity or origin of any communication;</li>
                <li>use the Services to send, upload, distribute, or disseminate unlawful, defamatory, harassing, abusive, fraudulent, infringing, obscene, excessively profane, hateful, violent, threatening, or malicious or otherwise objectionable material, or promote, support, or facilitate unlawful, hateful, discriminatory, or violent causes;</li>
                <li>interfere with or disrupt the operation of, or attempt to gain unauthorized access to, the Services or the servers or networks used to make the Services available, including by hacking or defacing any portion of the Services; or violate any requirement, procedure or policy of such servers or networks;</li>
                <li>interfere with or compromise the integrity of any information, data, content or other materials available in or through the Services;</li>
                <li>access, store, distribute or transmit any viruses, Trojan horses, or any other malicious code or program when using the Services;</li>
                <li>decompile, disassemble, or reverse engineer or attempt to derive any source code from any part of the Services, except to the extent necessary to obtain information for the interoperability of Services as provided by applicable mandatory laws and only to the extent that such information is not available to the User;</li>
                <li>frame or mirror any portion of the Services, or otherwise incorporate any portion of the Services into any product or service, systematically download and store any information, data, content or other materials available in or through the Services except as expressly authorized in the Terms or by separate express, written consent from the rights-holders;</li>
                <li>use any robot, spider, site search/retrieval application or other manual or automatic device to retrieve, index, “scrape,” “data mine” or otherwise gather any information, data, content or other materials available in or through the Services, to the extent such operations are not expressly authorized according to the applicable Terms.</li>
              </ol>
            </p>

            <p>Subject only to the permitted use specified in the Terms, User shall notify TOPIO immediately if she becomes aware of any unauthorized use of or access to any Services and take all such steps as are necessary to ensure compliance by its employees, agents and sub-contractors with the provisions of this Section.</p>
          </div>
          <h2 class="terms__main__title" id="main15">{{ getTitle(15) }}</h2>
          <div class="terms__main__text">
            <p>Without prejudice to the specific term of each License Agreement, each User may terminate her User Account if User no longer wishes to use the Services. After termination, User will no longer have access to the Services and TOPIO may restrict, deactivate or delete User’s Account, and all associated information, unless access is still required to comply with a valid License Agreement that remains in force.</p>
            <p>TOPIO may suspend or terminate User’s Account or restrict access to certain parts of the Services if TOPIO reasonably believes that User breached the Terms or with a ten (10) days prior notice if User has not signed into the Services in the past twelve (12) months.</p>
            <p>Access to the User’s Account or certain parts of the Services may also be restricted if verifications regarding the User’s identity and the accuracy of the information provided during the registration process (or any update) are pending or concluded unsuccessfully.</p>
            <p>Suspension or termination of User’s Account (i) will have no effect to any License Agreement concluded via TOPIO’s Services which will remain entirely valid between the parties concerned (ii) shall be without prejudice to any other rights or remedies TOPIO or any other User may be entitled to hereunder or at law and shall not affect any accrued rights or liabilities of either party nor the coming into or continuance in force of any provision hereof which is expressly or by implication intended to come into or continue in force on or after such termination.</p>
            <p>TOPIO will not be reliable for any losses resulting from any restriction, suspension or termination of a User Account that occurs in compliance with the Terms.</p>
          </div>
          <h2 class="terms__main__title" id="main16">{{ getTitle(16) }}</h2>
          <div class="terms__main__text">
            <p>THIS CLAUSE APPLIES TO TOPIO’S LIABILITY (INCLUDING ANY LIABILITY FOR THE ACTS AND OMISSIONS OF ITS EMPLOYEES, AGENTS AND SUB-CONTRACTORS) IN RESPECT OF ANY BREACH OF ITS CONTRACTUAL OBLIGATIONS TO PROVIDE THE SERVICES ARISING UNDER THE TERMS AND ANY REPRESENTATION, STATEMENT OR TORTIOUS ACT OR OMISSION INCLUDING NEGLIGENCE AND ANY OTHER FORM OF LIABILITY, AND USER’S ATTENTION IS IN PARTICULAR DRAWN TO THE PROVISIONS OF THIS CLAUSE.</p>
            <p>
              EXCEPT AS PROVIDED FOR UNDER APPLICABLE MANDATORY LEGAL PROVISIONS THAT CANNOT BE EXCLUDED BY AN AGREEMENT:
              <ul class="dashed">
                <li>TOPIO’S ENTIRE LIABILITY SHALL BE LIMITED TO AN AMOUNT EQUAL TO THE AGGREGATE OF THE PRICE PAID TO TOPIO FOR THE SERVICES CONCERNED IN RESPECT OF THE 12-MONTH PERIOD PRIOR TO THE DATE ON WHICH THE DAMAGE OCCURED;</li>
                <li>TOPIO SHALL NOT BE LIABLE TO USER FOR (I) ANY LOSS OF PROFITS, BUSINESS, ANTICIPATED SAVINGS, GOODWILL, DATA OR OTHER SUCH LOSS; OR (II) ANY TYPE OF SPECIAL INDIRECT, INCIDENTAL OR CONSEQUENTIAL LOSS OR DAMAGE; IN EACH CASE INCLUDING LOSS OR DAMAGE SUFFERED BY USER AS A RESULT OF AN ACTION BROUGHT BY A THIRD PARTY AND EVEN IF SUCH LOSS WAS REASONABLY FORESEEABLE OR TOPIO HAD BEEN ADVISED OF THE POSSIBILITY OF USER INCURRING THE SAME.</li>
              </ul>
            </p>
          </div>
          <h2 class="terms__main__title" id="main17">{{ getTitle(17) }}</h2>
          <div class="terms__main__text">
            <p>TO THE FULLEST EXTENT PERMITTED BY LAW, ANY WARRANTIES EXPRESSLY SET OUT IN THE TERMS ARE EXCLUSIVE OF AND IN LIEU OF ALL OTHER WARRANTIES, CONDITIONS, TERMS, UNDERTAKINGS AND OBLIGATIONS IMPLIED BY STATUTE, COMMON LAW, CUSTOM, TRADE USAGE, COURSE OF DEALING OR OTHERWISE WHICH RELATE TO THE QUALITY AND CONDITION OF THE SERVICES, WITHIN THE LIMITS OF WHAT WILL BE CONSIDERED TOPIO'S ESSENTIAL OBLIGATION AS A DEBTOR REGARDING THE PROVISION OF THE SERVICES.</p>
            <p>ALL TRADE NAMES, TRADEMARKS, SERVICE MARKS AND LOGOS THAT APPEAR IN OR ARE MADE AVAILABLE THROUGH TOPIO’S SERVICES AND ARE NOT OWNED BY TOPIO ARE THE PROPERTY OF THEIR RESPECTIVE OWNERS. NOTHING IN THE TERMS AND NOTHING IN OR AVAILABLE THROUGH TOPIO’S SERVICES SHOULD BE CONSTRUED AS GRANTING ANY RIGHT TO USE ANY TRADE NAME, TRADEMARK, SERVICE MARK OR LOGO WITHOUT THE EXPRESS PRIOR WRITTEN CONSENT OF ITS OWNER OR LICENSOR.</p>
            <p>ANY COMMUNICATION TOOLS MADE AVAILABLE TO USERS AS PART OF TOPIO’S SERVICES AND ALLOWING USERS TO EXCHANGE INFORMATION WILL NOT BE CONSIDERED A PRIVATE MESSAGING SYSTEM.</p>
            <p>USERS ACKOWLEDGE THAT THE USE OF THE SERVICES ARE THEIR OWN RISKS. UNLESS OTHERWISE SPECIFICALLY UNDERTAKEN BY TOPIO, THE SERVICES (OR ANY PART, FEATURE, SOFTWARE OR CONTENT THEREOF, INCLUDING ANY PART, FEATURE, SOFTWARE, OR CONTENT OFFERED ON OR THROUGH THE SERVICES BY THIRD PARTIES OR MADE AVAILABLE IN CONJUNCTION WITH OR THROUGH THE SERVICES), ARE PROVIDED ON AN "AS IS", "AS AVAILABLE", "WITH ALL FAULTS" BASIS AND WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND AND WITHOUT ANY EXPRESS OR IMPLIED CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT OF PRORPIETARY RIGHTS, OR ANY OTHER WARRANTY – ALL TO THE FULLEST EXTENT PERMITTED BY LAW.</p>
            <p>UNLESS EXRESSLY PROVIDED UNDER THE TERMS, TOPIO DOES NOT REPRESENT OR WARRANT THAT THE SERVICES (OR ANY PART, FEATURE, SOFTWARE OR CONTENT THEREOF, INCLUDING ANY PART, FEATURE, SOFTWARE, OR CONTENT OFFERED ON OR THROUGH THE SERVICES BY THIRD PARTIES OR MADE AVAILABLE IN CONJUNCTION WITH OR THROUGH THE SERVICES) ARE COMPLETE, ACCURATE, CORRECT, USEFUL, OF ANY CERTAIN QUALITY, RELIABLE OR SECURE IN ANY WAY, UNINTERRUPTED, OR FREE OF ERRORS, WORMS, TROJAN HORSES, VIRUSES, SPYWARE, OR OTHER HARMFUL COMPONENTS THAT MAY BE TRANSMITTED IN CONNECTION THEREWITH, OR SUITABLE FOR OR COMPATIBLE WITH ANY OF USER’S CONTEMPLATED ACTIVITIES, DEVICES, OPERATING SYSTEMS, BROWSERS, SOFTWARE OR TOOLS (OR THAT THEY WILL REMAIN AS SUCH AT ANY TIME), OR COMPLY WITH ANY LAWS APPLICABLE TO USERS (INCLUDING IN ANY JURISDICTION IN WHICH THEY OPERATE). TOPIO DOES NOT WARRANT THAT ANY OF THE FOREGOING WILL BE CORRECTED.</p>
            <p>WHEN USING THE SERVICES, USERS MAY BE EXPOSED TO CONTENT SUBMITTED BY OTHER USERS OR THIRD PARTIES. UNLESS OTHERWISE SPECIFICALLY UNDERTAKEN BY TOPIO, TOPIO NEITHER CONTROLS NOR ENDORSES NOR IS RESPONSIBLE FOR ANY CONTENT PROVIDED BY USERS OR THIRD PARTIES REGARDING CONTENT’S ACCURACY, VALIDITY, TIMELINESS, COMPLETENESS, RELIABILITY, INTEGRITY, QUALITY, LEGALITY, USEFULNESS OR SAFETY. UNDER NO CIRCUMSTANCES, WILL TOPIO BE LIABLE IN ANY WAY FOR OR IN CONNECTION WITH ANY USER OR THIRD-PARTY CONTENT, INCLUDING, BUT NOT LIMITED TO, ANY ERRORS, OMISSIONS, OR INTELLECTUAL PROPERTY RIGHTS INFRINGEMENT WITHIN SUCH CONTENT, OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF SUCH CONTENT.</p>
            <p>SUBJECT TO THE PROVISIONS OF THESE TERMS, USER’S SOLE AND EXCLUSIVE REMEDY FOR DISSATISFACTION WITH ANY SERVICES IS TO STOP USING THE APPLICABLE SERVICES. USER WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO USER’S PROPERTY (INCLUDING COMPUTER SYSTEMS) OR LOSS OF DATA THAT WOULD RESULT FROM USE OF THE SERVICES.</p>
            <p>NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY USER FROM TOPIO OR THROUGH THE SERVICES, WILL CREATE ANY WARRANTY NOT EXPRESSLY STATED IN THE TERMS.</p>
            <p>ALL LIMITATIONS OF LIABILITY OF ANY KIND (INCLUDING IN THIS SECTION AND ELSEWHERE IN THE TERMS) ARE MADE FOR THE BENEFIT OF BOTH TOPIO AND TOPIO’S AFFILIATES, AND ITS AND THEIR RESPECTIVE SHAREHOLDERS, DIRECTORS, OFFICERS, EMPLOYEES, AFFILIATES, AGENTS, REPRESENTATIVES, LICENSORS, SUPPLIERS AND SERVICE PROVIDERS, AND THEIR RESPECTIVE SUCCESSORS AND ASSIGNS.</p>
          </div>
          <h2 class="terms__main__title" id="main18">{{ getTitle(18) }}</h2>
          <div class="terms__main__text">
            <p>While providing the Services, TOPIO may collect and process Personal Data and request and require User’s consent that TOPIO will collect, use, and share personally identifiable information.</p>
            <p>By using or accessing the Services, Users acknowledge that they accept the practices and policies outlined in TOPIO’s Privacy Policy available at <a href="https://topio.market/privacy">https://topio.market/privacy</a> and incorporated in the Terms.</p>
            <p>Users must not make any Personal Data (including Users’ own Personal Data and those of any other person) publicly available through the Services (except User’s Personal Data required during the registration process to create a User Account). Without limiting the foregoing, Users will be responsible for any Personal Data that Users make available through the Services and Users assume any and all relevant risks.</p>
          </div>
          <h2 class="terms__main__title" id="main19">{{ getTitle(19) }}</h2>
          <div class="terms__main__text">
            <p>THE TERMS SHALL BE SUBJECT TO, INTERPRETED AND CONSTRUED IN ACCORDANCE WITH THE SUBSTANTIVE LAWS OF FRANCE WITHOUT ANY REFERENCE TO CONFLICT OF LAW STATUTES. ANY DISPUTE, CONTROVERSY OR CLAIM ARISING OUT OF OR IN RELATION TO THE SERVICES AND APPLICABLE TERMS SHALL BE SUBMITTED TO THE EXCLUSIVE JURISDICTION OF THE COURTS IN PARIS, FRANCE.</p>
          </div>
          <h2 class="terms__main__title" id="main20">{{ getTitle(20) }}</h2>
          <div class="terms__main__text">
            <p>Failure or delay by TOPIO to exercise or enforce any rights will not be construed as a waiver of its rights under the Terms or otherwise. No waiver by TOPIO of any breach of the Terms by any User shall be considered as a waiver of any subsequent breach of the same or any other provision.</p>
          </div>
          <h2 class="terms__main__title" id="main21">{{ getTitle(21) }}</h2>
          <div class="terms__main__text">
            <p>User shall make all necessary fillings and pay all costs including fees, penalties, and all other out-of-pocket costs associated if any government reporting or approval process were applicable and required for this specific User to access and use the Services. User shall observe all applicable (country) and foreign laws with respect to the use of the Services and hold TOPIO harmless from and against any claims, damages, remedies arising out of or related with the use of the Services in breach of any applicable regulations.</p>
            <p>User is sole responsible for complying with applicable export controls and economic sanctions, including any applicable import laws, regulations and requirements of the country of importation, and all other applicable laws, regulations and requirements which may apply to User’s jurisdiction. User is sole responsible for any violation of those laws, regulations and requirements.</p>
            <p>TOPIO provides no assurances that requests passing through any Services to the User have been screened in any way. For example, TOPIO does not provide screening to identify parties that may be subject to export/import restrictions, nor provides screening to identify destinations that may be subject to embargo or other restrictions.</p>
            <p>User represents, warrants and covenants that User is not: (i) located in, or a resident or national of, any country subject to a government embargo or other restriction, or that has been designated by a government as a “terrorist supporting” country; or (ii) on any government list of restricted end users.</p>
          </div>
          <h2 class="terms__main__title" id="main22">{{ getTitle(22) }}</h2>
          <div class="terms__main__text">
            <p>If any provision (or part of a provision) of the Terms is held by any competent authority to be invalid or unenforceable in whole or in part, that provision or part will be deemed deleted, and the validity of the other provisions of the Terms and the remainder of the provision in question shall not be affected thereby.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component
export default class Terms extends Vue {
  menuItems = [
    'General Provisions',
    'Definitions',
    'Registration',
    'Grant of rights to use Services and Content',
    'API creation',
    'Content offer and ranking transparency',
    'Storage space and paid features',
    'Homogenized contracting process',
    'Content delivery',
    'Pricing',
    'Payment processing',
    'Complaints and dispute resolution process',
    'Services’ availability and performance',
    'Unauthorized use of Services',
    'Restriction, suspension or termination of a User Account',
    'LIMITATIONS OF LIABILITY',
    'GENERAL DISCLAIMER',
    'Personal Data - Privacy Policy',
    'Governing Law - Jurisdiction',
    'Waiver',
    'Government regulations',
    'Partial validity',
  ];

  activeMenuItem = 1;

  TitleOffsets = [];

  topPos = 0;

  mounted():void {
    this.initAOS();
    window.addEventListener('scroll', this.changeActiveSideItem);
  }

  getTitle(sectionIndex: number): string {
    return `${sectionIndex}. ${this.menuItems[sectionIndex - 1]}`;
  }

  changeActiveSideItem():void {
    const titles:any = document.getElementsByClassName('terms__main__title');
    // const titlesArray = Array.prototype.slice.call(titles);
    for (let i = 0; i <= titles.length; i += 1) {
      if (titles[i]) {
        if (document.documentElement.scrollTop + 245 >= titles[i].offsetTop) {
          this.activeMenuItem = i + 1;
        }
      }
    }
  }

  initAOS = (): void => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-cubic',
    });
  }

  scrollToSection(section:number):void {
    this.activeMenuItem = section;
    const MainID = `main${section}`;
    const MainEl = document.getElementById(MainID);
    if (MainEl) {
      this.topPos = MainEl.offsetTop;
    }
    document.documentElement.scrollTop = this.topPos - 230;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_terms.scss";
</style>
