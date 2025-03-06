import React, { useState, useEffect } from 'react';

const FarmSimulator = () => {
  // 遊戲狀態
  const [day, setDay] = useState(1);
  const [money, setMoney] = useState(1000);
  const [energy, setEnergy] = useState(100);
  const [inventory, setInventory] = useState({});
  const [fields, setFields] = useState(Array(6).fill(null));
  const [animals, setAnimals] = useState([]);
  const [timeRunning, setTimeRunning] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('farm');
  const [notification, setNotification] = useState(null);

  // 作物定義
  const crops = {
    wheat: { name: '小麥', growthTime: 3, cost: 10, sellPrice: 25, energyCost: 5 },
    carrot: { name: '胡蘿蔔', growthTime: 2, cost: 5, sellPrice: 15, energyCost: 3 },
    corn: { name: '玉米', growthTime: 4, cost: 15, sellPrice: 40, energyCost: 6 },
    tomato: { name: '番茄', growthTime: 5, cost: 20, sellPrice: 50, energyCost: 7 }
  };

  // 動物定義
  const animalTypes = {
    chicken: { name: '雞', cost: 50, productionTime: 2, product: 'egg', productName: '雞蛋', sellPrice: 15, energyCost: 4 },
    cow: { name: '牛', cost: 200, productionTime: 3, product: 'milk', productName: '牛奶', sellPrice: 50, energyCost: 8 },
    sheep: { name: '羊', cost: 150, productionTime: 4, product: 'wool', productName: '羊毛', sellPrice: 40, energyCost: 6 }
  };

  // 商品合成配方
  const recipes = {
    bread: { name: '麵包', ingredients: { wheat: 3 }, sellPrice: 100, energyCost: 10 },
    cheese: { name: '起司', ingredients: { milk: 2 }, sellPrice: 120, energyCost: 8 },
    yarn: { name: '紗線', ingredients: { wool: 3 }, sellPrice: 150, energyCost: 12 },
    tomatoSoup: { name: '番茄湯', ingredients: { tomato: 4 }, sellPrice: 200, energyCost: 15 }
  };

  // 遊戲時間控制
  useEffect(() => {
    let gameTimer;
    if (timeRunning) {
      gameTimer = setInterval(() => {
        advanceDay();
      }, 3000 / gameSpeed);
    }
    return () => clearInterval(gameTimer);
  }, [timeRunning, gameSpeed]);

  // 更新遊戲時間
  const advanceDay = () => {
    // 更新作物生長
    const newFields = [...fields];
    newFields.forEach((field, index) => {
      if (field && field.daysLeft > 0) {
        newFields[index] = { ...field, daysLeft: field.daysLeft - 1 };
      }
    });
    setFields(newFields);

    // 更新動物生產
    const newAnimals = [...animals];
    const inventoryCopy = { ...inventory };
    
    newAnimals.forEach((animal, index) => {
      if (animal.daysUntilProduction > 0) {
        newAnimals[index] = { ...animal, daysUntilProduction: animal.daysUntilProduction - 1 };
      } else {
        // 產出產品
        const product = animalTypes[animal.type].product;
        inventoryCopy[product] = (inventoryCopy[product] || 0) + 1;
        
        // 重置生產時間
        newAnimals[index] = { 
          ...animal, 
          daysUntilProduction: animalTypes[animal.type].productionTime 
        };
        
        // 顯示通知
        setNotification(`${animalTypes[animal.type].name}產出了${animalTypes[animal.type].productName}！`);
        setTimeout(() => setNotification(null), 3000);
      }
    });
    
    setAnimals(newAnimals);
    setInventory(inventoryCopy);
    
    // 更新天數
    setDay(day + 1);
    
    // 恢復一些能量
    setEnergy(Math.min(energy + 20, 100));
  };

  // 種植作物
  const plantCrop = (cropType, fieldIndex) => {
    if (money < crops[cropType].cost) {
      setNotification('金錢不足！');
      return;
    }
    if (energy < crops[cropType].energyCost) {
      setNotification('體力不足！');
      return;
    }
    
    const newFields = [...fields];
    newFields[fieldIndex] = {
      type: cropType,
      daysLeft: crops[cropType].growthTime,
      planted: day
    };
    
    setFields(newFields);
    setMoney(money - crops[cropType].cost);
    setEnergy(energy - crops[cropType].energyCost);
  };

  // 收穫作物
  const harvestCrop = (fieldIndex) => {
    const field = fields[fieldIndex];
    if (!field || field.daysLeft > 0) return;
    
    if (energy < 5) {
      setNotification('體力不足！');
      return;
    }
    
    const cropType = field.type;
    const newInventory = { ...inventory };
    newInventory[cropType] = (newInventory[cropType] || 0) + 1;
    
    const newFields = [...fields];
    newFields[fieldIndex] = null;
    
    setFields(newFields);
    setInventory(newInventory);
    setEnergy(energy - 5);
    setNotification(`收穫了${crops[cropType].name}！`);
  };

  // 購買動物
  const buyAnimal = (animalType) => {
    if (money < animalTypes[animalType].cost) {
      setNotification('金錢不足！');
      return;
    }
    
    if (animals.length >= 5) {
      setNotification('動物欄已滿！');
      return;
    }
    
    const newAnimal = {
      type: animalType,
      purchaseDay: day,
      daysUntilProduction: animalTypes[animalType].productionTime
    };
    
    setAnimals([...animals, newAnimal]);
    setMoney(money - animalTypes[animalType].cost);
    setNotification(`購買了${animalTypes[animalType].name}！`);
  };

  // 照顧動物
  const careForAnimal = (index) => {
    if (energy < animalTypes[animals[index].type].energyCost) {
      setNotification('體力不足！');
      return;
    }
    
    // 減少生產時間
    const newAnimals = [...animals];
    newAnimals[index] = { 
      ...newAnimals[index], 
      daysUntilProduction: Math.max(0, newAnimals[index].daysUntilProduction - 1) 
    };
    
    setAnimals(newAnimals);
    setEnergy(energy - animalTypes[animals[index].type].energyCost);
    setNotification(`照顧了${animalTypes[animals[index].type].name}！`);
  };

  // 製作產品
  const craftItem = (recipeKey) => {
    const recipe = recipes[recipeKey];
    
    // 檢查材料是否足夠
    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
      if (!inventory[ingredient] || inventory[ingredient] < amount) {
        setNotification(`材料不足: 缺少${amount}個${ingredient}！`);
        return;
      }
    }
    
    // 檢查能量是否足夠
    if (energy < recipe.energyCost) {
      setNotification('體力不足！');
      return;
    }
    
    // 消耗材料
    const newInventory = { ...inventory };
    for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
      newInventory[ingredient] -= amount;
    }
    
    // 添加產品
    newInventory[recipeKey] = (newInventory[recipeKey] || 0) + 1;
    
    setInventory(newInventory);
    setEnergy(energy - recipe.energyCost);
    setNotification(`製作了${recipe.name}！`);
  };

  // 銷售物品
  const sellItem = (itemType, category) => {
    if (!inventory[itemType] || inventory[itemType] <= 0) {
      setNotification('庫存不足！');
      return;
    }
    
    let sellPrice;
    if (category === 'crop') {
      sellPrice = crops[itemType].sellPrice;
    } else if (category === 'animal') {
      sellPrice = animalTypes[Object.keys(animalTypes).find(key => animalTypes[key].product === itemType)].sellPrice;
    } else if (category === 'recipe') {
      sellPrice = recipes[itemType].sellPrice;
    }
    
    const newInventory = { ...inventory };
    newInventory[itemType]--;
    
    setInventory(newInventory);
    setMoney(money + sellPrice);
    setNotification(`賣出了一個物品，獲得$${sellPrice}！`);
  };

  // 休息恢復能量
  const rest = () => {
    setEnergy(Math.min(energy + 50, 100));
    setNotification('休息了一下，恢復了能量！');
  };

  return (
    <div className="flex flex-col h-screen bg-green-50">
      {/* 頂部狀態欄 */}
      <div className="bg-green-800 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">快樂農場模擬器</div>
        <div className="flex space-x-6">
          <div>第 {day} 天</div>
          <div>$ {money}</div>
          <div>體力: {energy}/100</div>
          <div className="flex space-x-2">
            <button 
              className={`px-2 py-1 rounded ${timeRunning ? 'bg-red-500' : 'bg-green-500'}`}
              onClick={() => setTimeRunning(!timeRunning)}
            >
              {timeRunning ? '暫停' : '開始'}
            </button>
            <select 
              className="bg-green-700 rounded"
              value={gameSpeed}
              onChange={(e) => setGameSpeed(Number(e.target.value))}
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div>
        </div>
      </div>

      {/* 通知 */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
          {notification}
        </div>
      )}

      {/* 主選單 */}
      <div className="bg-green-600 text-white p-2 flex space-x-4">
        <button 
          className={`px-4 py-2 rounded-t ${activeTab === 'farm' ? 'bg-green-100 text-green-800' : 'bg-green-700'}`}
          onClick={() => setActiveTab('farm')}
        >
          農場
        </button>
        <button 
          className={`px-4 py-2 rounded-t ${activeTab === 'animals' ? 'bg-green-100 text-green-800' : 'bg-green-700'}`}
          onClick={() => setActiveTab('animals')}
        >
          動物
        </button>
        <button 
          className={`px-4 py-2 rounded-t ${activeTab === 'craft' ? 'bg-green-100 text-green-800' : 'bg-green-700'}`}
          onClick={() => setActiveTab('craft')}
        >
          製作
        </button>
        <button 
          className={`px-4 py-2 rounded-t ${activeTab === 'market' ? 'bg-green-100 text-green-800' : 'bg-green-700'}`}
          onClick={() => setActiveTab('market')}
        >
          市場
        </button>
        <button 
          className={`px-4 py-2 rounded-t ${activeTab === 'inventory' ? 'bg-green-100 text-green-800' : 'bg-green-700'}`}
          onClick={() => setActiveTab('inventory')}
        >
          庫存
        </button>
      </div>

      {/* 主內容區 */}
      <div className="flex-1 p-4 overflow-auto">
        {/* 農場界面 */}
        {activeTab === 'farm' && (
          <div>
            <h2 className="text-xl font-bold mb-4">我的農場</h2>
            <div className="grid grid-cols-3 gap-4">
              {fields.map((field, index) => (
                <div 
                  key={index} 
                  className="bg-amber-100 p-4 h-40 rounded-lg border-2 border-amber-300 flex flex-col items-center justify-center relative"
                >
                  {field ? (
                    <>
                      <div className="text-center mb-2">
                        {crops[field.type].name}
                        <div className="text-sm">
                          {field.daysLeft > 0 
                            ? `成長中: 還需 ${field.daysLeft} 天` 
                            : <span className="text-green-600 font-bold">已成熟！</span>}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 text-xs text-gray-500">
                        種植於第 {field.planted} 天
                      </div>
                      {field.daysLeft === 0 && (
                        <button 
                          className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => harvestCrop(index)}
                        >
                          收穫
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-2">空地</div>
                      <div className="flex space-x-2">
                        {Object.keys(crops).map(cropType => (
                          <button 
                            key={cropType}
                            className="bg-amber-500 text-white px-2 py-1 text-xs rounded"
                            onClick={() => plantCrop(cropType, index)}
                            title={`${crops[cropType].name} - 成長時間: ${crops[cropType].growthTime}天, 成本: $${crops[cropType].cost}`}
                          >
                            {crops[cropType].name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={rest}
            >
              休息 (+50 體力)
            </button>
          </div>
        )}

        {/* 動物界面 */}
        {activeTab === 'animals' && (
          <div>
            <h2 className="text-xl font-bold mb-4">我的動物</h2>
            <div className="grid grid-cols-3 gap-4">
              {animals.map((animal, index) => (
                <div 
                  key={index} 
                  className="bg-blue-100 p-4 rounded-lg border-2 border-blue-300"
                >
                  <div className="text-center mb-2">
                    {animalTypes[animal.type].name}
                    <div className="text-sm">
                      {animal.daysUntilProduction > 0 
                        ? `產出中: 還需 ${animal.daysUntilProduction} 天` 
                        : <span className="text-green-600 font-bold">可以收穫產品！</span>}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    購買於第 {animal.purchaseDay} 天
                  </div>
                  <button 
                    className="w-full bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => careForAnimal(index)}
                  >
                    照顧 (-{animalTypes[animal.type].energyCost} 體力)
                  </button>
                </div>
              ))}
              {animals.length < 5 && (
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-200 flex flex-col items-center justify-center">
                  <div className="text-center mb-4">購買新動物</div>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.keys(animalTypes).map(animalType => (
                      <button 
                        key={animalType}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => buyAnimal(animalType)}
                      >
                        {animalTypes[animalType].name} (${animalTypes[animalType].cost})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 製作界面 */}
        {activeTab === 'craft' && (
          <div>
            <h2 className="text-xl font-bold mb-4">製作商品</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(recipes).map(recipeKey => {
                const recipe = recipes[recipeKey];
                return (
                  <div 
                    key={recipeKey} 
                    className="bg-purple-100 p-4 rounded-lg border-2 border-purple-300"
                  >
                    <div className="text-lg font-bold mb-2">{recipe.name}</div>
                    <div className="mb-2">所需材料:</div>
                    <ul className="mb-4 text-sm">
                      {Object.entries(recipe.ingredients).map(([ingredient, amount]) => {
                        const ingredientName = crops[ingredient] 
                          ? crops[ingredient].name 
                          : Object.values(animalTypes).find(a => a.product === ingredient)?.productName || ingredient;
                        
                        return (
                          <li key={ingredient} className="flex justify-between">
                            <span>{ingredientName} x{amount}</span>
                            <span className={inventory[ingredient] >= amount ? 'text-green-600' : 'text-red-600'}>
                              {inventory[ingredient] || 0}/{amount}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="flex justify-between items-center">
                      <div>賣價: ${recipe.sellPrice}</div>
                      <button 
                        className="bg-purple-500 text-white px-3 py-1 rounded"
                        onClick={() => craftItem(recipeKey)}
                      >
                        製作 (-{recipe.energyCost} 體力)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 市場界面 */}
        {activeTab === 'market' && (
          <div>
            <h2 className="text-xl font-bold mb-4">市場</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                <h3 className="font-bold mb-2">農作物</h3>
                <div className="space-y-2">
                  {Object.keys(crops).map(cropType => {
                    const crop = crops[cropType];
                    const count = inventory[cropType] || 0;
                    return (
                      <div key={cropType} className="flex justify-between items-center">
                        <div>
                          {crop.name} (持有: {count})
                        </div>
                        {count > 0 && (
                          <button 
                            className="bg-yellow-500 text-white px-2 py-1 text-sm rounded"
                            onClick={() => sellItem(cropType, 'crop')}
                          >
                            賣出 (${crop.sellPrice})
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <h3 className="font-bold mb-2">動物產品</h3>
                <div className="space-y-2">
                  {Object.values(animalTypes).map(animal => {
                    const product = animal.product;
                    const count = inventory[product] || 0;
                    return (
                      <div key={product} className="flex justify-between items-center">
                        <div>
                          {animal.productName} (持有: {count})
                        </div>
                        {count > 0 && (
                          <button 
                            className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
                            onClick={() => sellItem(product, 'animal')}
                          >
                            賣出 (${animal.sellPrice})
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <h3 className="font-bold mb-2">加工商品</h3>
                <div className="space-y-2">
                  {Object.keys(recipes).map(recipeKey => {
                    const recipe = recipes[recipeKey];
                    const count = inventory[recipeKey] || 0;
                    return (
                      <div key={recipeKey} className="flex justify-between items-center">
                        <div>
                          {recipe.name} (持有: {count})
                        </div>
                        {count > 0 && (
                          <button 
                            className="bg-purple-500 text-white px-2 py-1 text-sm rounded"
                            onClick={() => sellItem(recipeKey, 'recipe')}
                          >
                            賣出 (${recipe.sellPrice})
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 庫存界面 */}
        {activeTab === 'inventory' && (
          <div>
            <h2 className="text-xl font-bold mb-4">我的庫存</h2>
            {Object.keys(inventory).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.entries(inventory).map(([item, count]) => {
                  if (count <= 0) return null;
                  
                  let itemName, category;
                  if (crops[item]) {
                    itemName = crops[item].name;
                    category = 'crop';
                  } else if (Object.values(animalTypes).some(a => a.product === item)) {
                    const animal = Object.values(animalTypes).find(a => a.product === item);
                    itemName = animal.productName;
                    category = 'animal';
                  } else if (recipes[item]) {
                    itemName = recipes[item].name;
                    category = 'recipe';
                  } else {
                    itemName = item;
                    category = 'unknown';
                  }
                  
                  return (
                    <div 
                      key={item} 
                      className="bg-gray-100 p-4 rounded-lg border-2 border-gray-200 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{itemName}</div>
                        <div className="text-sm text-gray-600">數量: {count}</div>
                      </div>
                      <button 
                        className="bg-green-500 text-white px-2 py-1 text-sm rounded"
                        onClick={() => sellItem(item, category)}
                      >
                        賣出
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500">庫存為空</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmSimulator;
