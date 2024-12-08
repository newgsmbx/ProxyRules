// 2024-08-20 09:49
// 2024-11-28 更新 

const url = $request.url;
if (!$response.body) $done({});

let obj = JSON.parse($response.body);

if (url.includes("/other/pGetSceneList")) {
  if (obj && obj.data && obj.data.scene_list instanceof Array) {
    obj.data.scene_list = obj.data.scene_list.filter(item => item.text !== "优惠商城");
  }
  if (obj && obj.data && obj.data.show_data instanceof Array) {
    obj.data.show_data.forEach((block) => {
      if (block.scene_ids instanceof Array) {
        block.scene_ids = block.scene_ids.filter(id => id !== "scene_coupon_mall");
      }
    });
  }
}

if (url.includes("/homepage/v1/core")) {
  const keepNavIds = ['dache_anycar', 'driverservice', 'bike', 'pincheche', 'nav_more_v2'];
  if (obj.data && obj.data.order_cards && obj.data.order_cards.nav_list_card && obj.data.order_cards.nav_list_card.data) {
    obj.data.order_cards.nav_list_card.data = obj.data.order_cards.nav_list_card.data.filter(item => keepNavIds.includes(item.nav_id));
  }
  const keepBottomNavIds = ['v6x_home', 'home_page', 'user_center'];
  if (obj.data && obj.data.disorder_cards && obj.data.disorder_cards.bottom_nav_list && obj.data.disorder_cards.bottom_nav_list.data) {
    obj.data.disorder_cards.bottom_nav_list.data = obj.data.disorder_cards.bottom_nav_list.data.filter(item => keepBottomNavIds.includes(item.id));
  }
  if (obj.data && obj.data.order_cards && obj.data.order_cards.nav_list_card && obj.data.order_cards.nav_list_card.data) {
    obj.data.order_cards.nav_list_card.data[2].icon_size = "big";
    obj.data.order_cards.nav_list_card.data[3].icon_size = "big";
    obj.data.order_cards.nav_list_card.data[4].icon_size = "big";
  }
}


if (url.includes("/ota/na/yuantu/infoList")) {
  if (obj.data && obj.data.disorder_cards && obj.data.disorder_cards.top_banner_card && obj.data.disorder_cards.top_banner_card.data && obj.data.disorder_cards.top_banner_card.data[0] && obj.data.disorder_cards.top_banner_card.data[0].T === "yuentu_top_banner") {
    obj.data.disorder_cards.top_banner_card.data.splice(0, 1);
  }
}

if (url.includes("/gulfstream/passenger-center/v2/other/pInTripLayout")) {
  const namesToRemove = ["passenger_common_casper"];
  obj.data.order_components = obj.data.order_components.filter(
    component => !(component.name && namesToRemove.includes(component.name))
  );
}

if (url.includes("/usercenter/me")) {
  const excludedTitles = ['天天领福利', '金融服务', '更多服务', '企业服务', '安全中心'];

  if (obj.data && obj.data.cards) {
    obj.data.cards = obj.data.cards.filter(card => !excludedTitles.includes(card.title));

    obj.data.cards.forEach(card => {
      if (card.tag === "wallet") {
        if (card.items) {
          card.items = card.items.filter(item => item.title === "优惠券" || item.title === "出行卡" || item.title === "福利金");
        }
        if (card.card_type === 4 && card.bottom_items) {
          card.bottom_items = card.bottom_items.filter(item => 
            item.title === "省钱套餐" || item.title === "出行里程"
          );
        }
      }
    });
  }
}


if (url.includes("/passenger-wallet/api/v6/wallet/homepage")) {
    if (obj.data.popData && obj.data.popData.dialog) {
      delete obj.data.popData.dialog.buoyLandingUrl;
  }

  obj.data.cardList = obj.data.cardList.filter(card => {
    if (card.detailData) {
      if (card.detailData.discountList) {
        card.detailData.discountList = card.detailData.discountList.filter(discount => 
          !["信用卡额度", "滴滴专属"].includes(discount.mname)
        );
      }
      
      if ('myCreditLimit' in card.detailData) {
        delete card.detailData.myCreditLimit;
      }

      if (["借钱", "信用卡", "滴滴保", "我的额度"].includes(card.detailData.mname)) {
        return false;
      }

      if (card.detailData.billCard && card.detailData.billCard.title === "滴滴支付") {
        return false;
      }

      if (card.detailData.icon1) {
        card.detailData.icon1.forEach(icon => delete icon.cornerContent);
      }
      if (card.detailData.icon2) {
        card.detailData.icon2.forEach(icon => delete icon.cornerContent);
      }
    }

    if (card.mcode === "market_banner_v6" || card.cardId === "bizcard_loan_v6" || card.cardId === "bizcard_creditCard_v6") {
      return false;
    }

    return true;
  });

  obj.data.chinesename = " ";

}



$done({ body: JSON.stringify(obj) });
